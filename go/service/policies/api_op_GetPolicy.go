package policies

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) GetPolicy(policyId string) (*PolicyDefinition, error) {
	endpoint := fmt.Sprintf("%s/policydefinitions/%s", *c.Addresses.Management, policyId)
	policyDefinition := &PolicyDefinition{}

	if err := c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodGet,
		Endpoint:           endpoint,
		ResponsePayload:    policyDefinition,
		ExpectedStatusCode: http.StatusOK,
	}); err != nil {
		return nil, err
	}

	return policyDefinition, nil
}
