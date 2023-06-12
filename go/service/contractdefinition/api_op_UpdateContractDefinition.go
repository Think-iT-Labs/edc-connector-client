package contractdefinition

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) UpdateContractDefinition(cd ContractDefinition) error {
	endpoint := fmt.Sprintf("%s/contractdefinitions/%s", *c.Management, cd.Id)
	return c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Endpoint:           endpoint,
		Method:             http.MethodPut,
		RequestPayload:     cd,
		ExpectedStatusCode: http.StatusNoContent,
	})
}
