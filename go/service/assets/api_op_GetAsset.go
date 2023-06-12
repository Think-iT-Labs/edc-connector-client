package assets

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) GetAsset(assetId string) (*AssetOutput, error) {
	endpoint := fmt.Sprintf("%s/assets/%s", *c.Addresses.Management, assetId)
	asset := &AssetOutput{}

	err := c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodGet,
		Endpoint:           endpoint,
		ResponsePayload:    asset,
		ExpectedStatusCode: http.StatusOK,
	})
	if err != nil {
		return nil, err
	}

	return asset, nil
}

func (c *Client) GetAssetDataAddress(assetId string) (*AssetDataAddressOutput, error) {
	endpoint := fmt.Sprintf("%s/assets/%s/address", *c.Addresses.Management, assetId)
	asset := AssetDataAddressOutput{}

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusOK {
		return nil, sdkErrors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	err = json.Unmarshal(response, &asset)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
	}

	return &asset, err
}
