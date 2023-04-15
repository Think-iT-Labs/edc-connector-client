package assets

import (
	"fmt"
	"io"
	"net/http"
)

func (c *Client) DeleteAsset(assetId string) error {
	endpoint := fmt.Sprintf("%v/assets/%v", *c.Addresses.Management, assetId)

	req, err := http.NewRequest("DELETE", endpoint, nil)
	if err != nil {
		return fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("error while performing DELETE request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	return err
}
