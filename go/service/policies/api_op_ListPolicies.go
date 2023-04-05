package policies

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type SortOrder string

const (
	SortOrderAscendant  SortOrder = "ASC"
	SortOrderDescendant SortOrder = "DESC"
)

type Criterion struct {
	OperandLeft  string
	OperandRight *string
	Operator     string
}

type ListPoliciesInput struct {
	Filter           *string      `json:"filter,omitempty"`
	FilterExpression *[]Criterion `json:"filterExpression,omitempty"`
	Limit            *int64       `json:"limit,omitempty"`
	Offset           *int64       `json:"offset,omitempty"`
	SortField        *string      `json:"sortField,omitempty"`
	SortOrder        *SortOrder   `json:"sortOrder,omitempty"`
}

func (c *Client) ListPolicies(listPoliciesInput ListPoliciesInput) ([]PolicyDefinition, []ApiErrorDetail, error) {
	err := validateQueryPoliciesInput(listPoliciesInput.SortOrder)
	if err != nil {
		return nil, nil, err
	}
	endpoint := fmt.Sprintf("%v/policydefinitions/request", *c.Addresses.Management)
	policies := []PolicyDefinition{}

	listPoliciesInputJson, err := json.Marshal(listPoliciesInput)

	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while marshaling list policies input: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(listPoliciesInputJson))
	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, nil, fmt.Errorf("error while reading response body: %v", err)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		var v []ApiErrorDetail
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
		}
		return nil, v, nil
	}

	err = json.Unmarshal(response, &policies)
	if err != nil {
		return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return policies, nil, err
}

func validateQueryPoliciesInput(sortOrder *SortOrder) error {
	if sortOrder == nil {
		return nil
	}
	if *sortOrder != SortOrderAscendant && *sortOrder != SortOrderDescendant {
		return fmt.Errorf("invalid value of sortOrder, possible values are: %v",
			[]SortOrder{SortOrderAscendant, SortOrderDescendant})
	}
	return nil
}
