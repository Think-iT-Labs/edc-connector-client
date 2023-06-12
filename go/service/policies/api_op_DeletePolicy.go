package policies

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) DeletePolicy(policyId string) error {
	endpoint := fmt.Sprintf("%s/policydefinitions/%s", *c.Addresses.Management, policyId)

	return c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodDelete,
		Endpoint:           endpoint,
		ExpectedStatusCode: http.StatusNoContent,
	})
}
