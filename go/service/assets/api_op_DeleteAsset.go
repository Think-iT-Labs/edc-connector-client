package assets

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) DeleteAsset(assetId string) error {
	endpoint := fmt.Sprintf("%s/assets/%s", *c.Addresses.Management, assetId)

	req, err := http.NewRequest(http.MethodDelete, endpoint, nil)
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
			return errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
		}
		// TODO: can return more than 1 element in error array???
		return errors.FromError(v[0]).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	return nil
}
