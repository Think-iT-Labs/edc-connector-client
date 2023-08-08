package assets

import (
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/apivalidator"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) ListAssets(args ...apivalidator.QueryInput) ([]AssetProperties, error) {
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

	endpoint := fmt.Sprintf("%s/assets/request", *c.Addresses.Management)
	assets := []AssetProperties{}

	err := c.HTTPClient.InvokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodPost,
		Endpoint:           endpoint,
		RequestPayload:     queryInput,
		ResponsePayload:    assets,
		ExpectedStatusCode: http.StatusOK,
	})
	if err != nil {
		return nil, err
	}

	return assets, nil
}
