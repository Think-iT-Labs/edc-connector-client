package contractdefinition

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) CreateContractDefinition(cd ContractDefinition) (*CreateContractDefinitionOutput, error) {
	endpoint := fmt.Sprintf("%s/contractdefinitions", *c.Management)
	contractDefinitionOutput := &CreateContractDefinitionOutput{}

	if err := c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodPost,
		Endpoint:           endpoint,
		RequestPayload:     cd,
		ResponsePayload:    contractDefinitionOutput,
		ExpectedStatusCode: http.StatusOK,
	}); err != nil {
		return nil, err
	}

	return contractDefinitionOutput, nil
}
