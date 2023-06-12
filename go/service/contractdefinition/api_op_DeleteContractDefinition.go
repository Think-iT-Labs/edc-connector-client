package contractdefinition

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) DeleteContractDefinition(cDefId string) error {
	endpoint := fmt.Sprintf("%s/contractdefinitions/%s", *c.Addresses.Management, cDefId)

	return c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodDelete,
		Endpoint:           endpoint,
		ExpectedStatusCode: http.StatusNoContent,
	})
}
