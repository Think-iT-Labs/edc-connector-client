package assets

import (
	"fmt"
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
	assets := &[]AssetOutput{}

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

	return *assets, nil
}
