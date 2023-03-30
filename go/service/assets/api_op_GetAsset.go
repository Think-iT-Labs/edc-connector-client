package assets

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func (c *Client) GetAsset(assetId string) (*AssetOutput, error) {
	endpoint := fmt.Sprintf("%v/assets/%v", *c.Addresses.Management, assetId)
	asset := AssetOutput{}

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing GET request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	err = json.Unmarshal(response, &asset)
	if err != nil {
		return nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return &asset, err
}
