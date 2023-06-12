package contractdefinition

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/apivalidator"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) ListContractDefinitions(args ...apivalidator.QueryInput) ([]GetContractDefinitionOutput, error) {
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

	endpoint := fmt.Sprintf("%s/contractdefinitions/request", *c.Addresses.Management)
	contractDefinitions := &[]GetContractDefinitionOutput{}

	if err := c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Endpoint:           endpoint,
		Method:             http.MethodPost,
		ExpectedStatusCode: http.StatusOK,
		RequestPayload:     queryInput,
		ResponsePayload:    contractDefinitions,
	}); err != nil {
		return nil, err
	}

	return *contractDefinitions, nil
}
