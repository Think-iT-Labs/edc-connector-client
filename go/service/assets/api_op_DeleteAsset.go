package assets

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) DeleteAsset(assetId string) error {

	endpoint := fmt.Sprintf("%s/assets/%s", *c.Addresses.Management, assetId)

	return c.HTTPClient.InvokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodDelete,
		Endpoint:           endpoint,
		ExpectedStatusCode: http.StatusNoContent,
	})
}
