package contractdefinition

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) GetContractDefinition(ContractDefinitionId string) (*GetContractDefinitionOutput, error) {
	endpoint := fmt.Sprintf("%s/contractdefinitions/%s", *c.Addresses.Management, ContractDefinitionId)
	contractDefinition := &GetContractDefinitionOutput{}

	if err := c.HTTPClient.InvokeOperation(internal.InvokeHTTPOperationOptions{
		Endpoint:           endpoint,
		Method:             http.MethodGet,
		ResponsePayload:    contractDefinition,
		ExpectedStatusCode: http.StatusOK,
	}); err != nil {
		return nil, err
	}
	return contractDefinition, nil
}
