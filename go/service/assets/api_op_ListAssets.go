package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/apivalidator"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

type AssetOutput struct {
	CreatedAt       int64             `json:"createdAt"`
	Id              string            `json:"id"`
	AssetProperties map[string]string `json:"properties"`
}

func (c *Client) ListAssets(args ...apivalidator.QueryInput) ([]AssetOutput, error) {
	var queryInput apivalidator.QueryInput

	if len(args) > 0 {
		queryInput = args[0]
		err := apivalidator.ValidateQueryInput(args[0].SortOrder)
		if err != nil {
			return nil, err
		}
	} else {
		queryInput = apivalidator.QueryInput{}
	}

	endpoint := fmt.Sprintf("%v/assets/request", *c.Addresses.Management)
	assets := []AssetOutput{}
	listAssetsQueryJson, err := json.Marshal(queryInput)

	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(listAssetsQueryJson))
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

	err = json.Unmarshal(response, &assets)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
	}

	return assets, nil
}
