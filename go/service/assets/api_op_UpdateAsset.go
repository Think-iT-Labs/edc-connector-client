package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) UpdateAssetProperties(asset AssetApiInput, assetId string) error {
	assetEndpoint := fmt.Sprintf("%s/assets/%s", *c.Addresses.Management, assetId)

	assetProperties, err := json.Marshal(asset)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPut, assetEndpoint, bytes.NewBuffer(assetProperties))
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusNoContent {
		// The assets API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return errors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
		// TODO: can return more than 1 element in error array???
		return errors.FromError(v[0]).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	return nil
}

func (c *Client) UpdateAssetDataAddress(dataAddress DataAddress, assetId string) error {
	dataAddressEndpoint := fmt.Sprintf("%s/assets/%s/dataaddress", *c.Addresses.Management, assetId)

	dataAddressPayload, err := createDataAddressFromInput(dataAddress)
	if err != nil {
		return err
	}

	assetDataAddress, err := json.Marshal(dataAddressPayload)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPut, dataAddressEndpoint, bytes.NewBuffer(assetDataAddress))
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusNoContent {
		return errors.FromError(internal.ParseConnectorApiError(response)).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	return nil
}
