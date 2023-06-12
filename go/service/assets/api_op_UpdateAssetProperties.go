package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal/sharedtypes"
)

type UpdateAssetPropertiesRequestPayload struct {
	sharedtypes.BaseRequest
	AssetProperties
}

func (c *Client) UpdateAssetProperties(assetId string, asset AssetProperties) error {
	assetEndpoint := fmt.Sprintf("%s/assets", *c.Addresses.Management)

	requestpayload, err := json.Marshal(UpdateAssetPropertiesRequestPayload{
		sharedtypes.BaseRequest{
			Id:      assetId,
			Context: sharedtypes.EdcContext,
		},
		asset,
	})
	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPut, assetEndpoint, bytes.NewBuffer(requestpayload))
	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusNoContent {
		return sdkErrors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	return nil
}
