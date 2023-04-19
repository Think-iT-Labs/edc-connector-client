package assets

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type AssetOutput struct {
	CreatedAt       int64             `json:"createdAt"`
	Id              string            `json:"id"`
	AssetProperties map[string]string `json:"properties"`
}

func (c *Client) ListAssets() ([]AssetOutput, error) {
	endpoint := fmt.Sprintf("%v/assets", *c.Addresses.Management)
	assets := []AssetOutput{}

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing GET request to the endpoint %v: %v", endpoint, err)
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
