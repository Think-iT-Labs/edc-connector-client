package policies

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/apivalidator"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

type ListPoliciesInput struct {
	Filter           *string                   `json:"filter,omitempty"`
	FilterExpression *[]apivalidator.Criterion `json:"filterExpression,omitempty"`
	Limit            *int64                    `json:"limit,omitempty"`
	Offset           *int64                    `json:"offset,omitempty"`
	SortField        *string                   `json:"sortField,omitempty"`
	SortOrder        *apivalidator.SortOrder   `json:"sortOrder,omitempty"`
}

func (c *Client) ListPolicies(args ...apivalidator.QueryInput) ([]PolicyDefinition, error) {
	var queryInput apivalidator.QueryInput

	if len(args) > 0 {
		queryInput = args[0]
		err := apivalidator.ValidateQueryInput(args[0].SortOrder)
		if err != nil {
			return nil, err
		}
	} else {
		queryInput = apivalidator.QueryInput{}
	}

	endpoint := fmt.Sprintf("%v/policydefinitions/request", *c.Addresses.Management)
	policies := &[]PolicyDefinition{}

	if err := c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Endpoint:           endpoint,
		Method:             http.MethodPost,
		RequestPayload:     queryInput,
		ResponsePayload:    policies,
		ExpectedStatusCode: http.StatusOK,
	}); err != nil {
		return nil, err
	}
	return *policies, nil
}
