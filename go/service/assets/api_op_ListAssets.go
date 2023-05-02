package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal/apivalidator"
)

type AssetOutput struct {
	CreatedAt       int64             `json:"createdAt"`
	Id              string            `json:"id"`
	AssetProperties map[string]string `json:"properties"`
}

func (c *Client) ListAssets(queryInput apivalidator.QueryInput) ([]AssetOutput, error) {
	err := apivalidator.ValidateQueryInput(queryInput.SortOrder)
	if err != nil {
		return nil, err
	}
	endpoint := fmt.Sprintf("%v/assets/request", *c.Addresses.Management)
	assets := []AssetOutput{}
	
	listAssetsQueryJson, err := json.Marshal(queryInput)

	if err != nil {
		return nil, fmt.Errorf("unexpected error while marshaling list assets query: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(listAssetsQueryJson))
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	err = json.Unmarshal(response, &assets)
	if err != nil {
		return nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return assets, err
}
