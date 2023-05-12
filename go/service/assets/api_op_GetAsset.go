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
	asset := AssetOutput{}

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusOK {
		// The assets API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
		}
		// TODO: can return more than 1 element in error array???
		return nil, errors.FromError(v[0]).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	err = json.Unmarshal(response, &asset)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
	}

	return &asset, err
}

func (c *Client) GetAssetDataAddress(assetId string) (*AssetDataAddressOutput, error) {
	endpoint := fmt.Sprintf("%s/assets/%s/address", *c.Addresses.Management, assetId)
	asset := AssetDataAddressOutput{}

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusOK {
		// The assets API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
		}
		// TODO: can return more than 1 element in error array???
		return nil, errors.FromError(v[0]).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	err = json.Unmarshal(response, &asset)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
	}

	return &asset, err
}
