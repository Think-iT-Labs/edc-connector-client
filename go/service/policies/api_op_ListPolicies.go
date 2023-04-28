package policies

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
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

func (c *Client) ListPolicies(listPoliciesInput ListPoliciesInput) ([]PolicyDefinition, error) {
	err := validateQueryPoliciesInput(listPoliciesInput.SortOrder)
	if err != nil {
		return nil, errors.Error("validation error")
	}
	endpoint := fmt.Sprintf("%s/policydefinitions/request", *c.Addresses.Management)
	policies := []PolicyDefinition{}

	listPoliciesInputJson, err := json.Marshal(listPoliciesInput)

	if err != nil {
		return nil, errors.Wrap(err).FailedTo("marshall input")
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(listPoliciesInputJson))
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("build request")
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("list policies")
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("read response")
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		// The policies API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, errors.Wrap(err).FailedTo("while unmarshaling json")
		}
		return nil, errors.Errorf("error from connector: %+v", v[0])
	}

	err = json.Unmarshal(response, &policies)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("while unmarshaling json")
	}

	return policies, nil
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
