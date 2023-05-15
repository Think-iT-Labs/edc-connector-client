package assets

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

type AssetOutput struct {
	CreatedAt       int64             `json:"createdAt"`
	Id              string            `json:"id"`
	AssetProperties map[string]string `json:"properties"`
}

func (c *Client) ListAssets() ([]AssetOutput, error) {
	endpoint := fmt.Sprintf("%s/assets", *c.Addresses.Management)
	assets := []AssetOutput{}

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
		return nil, errors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	err = json.Unmarshal(response, &assets)
	if err != nil {
		return nil, errors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
	}

	return assets, nil
}
