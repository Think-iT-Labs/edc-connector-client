package assets

import (
	"fmt"
	"net/http"
)

func (c *Client) DeleteAsset(assetId string) error {
	endpoint := fmt.Sprintf("%v/assets/%v", *c.Addresses.Management, assetId)

	req, err := http.NewRequest("DELETE", endpoint, nil)
	if err != nil {
		return fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	_, err = c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("error while performing DELETE request to the endpoint %v: %v", endpoint, err)
	}

	return err
}
