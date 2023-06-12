package assets

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) UpdateAssetProperties(asset AssetApiInput, assetId string) error {
	endpoint := fmt.Sprintf("%s/assets/%s", *c.Addresses.Management, assetId)

	return c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodPut,
		Endpoint:           endpoint,
		ExpectedStatusCode: http.StatusNoContent,
		RequestPayload:     asset,
	})
}

func (c *Client) UpdateAssetDataAddress(dataAddress DataAddress, assetId string) error {
	endpoint := fmt.Sprintf("%s/assets/%s/dataaddress", *c.Addresses.Management, assetId)

	payload, err := createDataAddressFromInput(dataAddress)
	if err != nil {
		return err
	}

	return c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Endpoint:           endpoint,
		Method:             http.MethodPut,
		RequestPayload:     payload,
		ExpectedStatusCode: http.StatusNoContent,
	})
}
