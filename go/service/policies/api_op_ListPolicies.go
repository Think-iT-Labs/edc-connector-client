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
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_INPUT_VALIDATE)
	}
	endpoint := fmt.Sprintf("%s/policydefinitions/request", *c.Addresses.Management)
	policies := []PolicyDefinition{}

	listPoliciesInputJson, err := json.Marshal(listPoliciesInput)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewBuffer(listPoliciesInputJson))
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		return nil, sdkErrors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	err = json.Unmarshal(response, &policies)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
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
