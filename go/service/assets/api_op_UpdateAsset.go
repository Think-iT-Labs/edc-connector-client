package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func (c *Client) UpdateAssetProperties(asset AssetApiInput, assetId string) error {
	assetEndpoint := fmt.Sprintf("%v/assets/%v", *c.Addresses.Management, assetId)

	assetProperties, err := json.Marshal(asset)
	if err != nil {
		return fmt.Errorf("unexpected error while marshaling create asset properties: %v", err)
	}

	req, err := http.NewRequest("PUT", assetEndpoint, bytes.NewBuffer(assetProperties))
	if err != nil {
		return fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("error while performing GET request to the endpoint %v: %v", assetEndpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, assetEndpoint, response)
	}

	return nil
}

func (c *Client) UpdateAssetDataAddress(dataAddress DataAddress, assetId string) error {
	dataAddressEndpoint := fmt.Sprintf("%v/assets/%v/dataaddress", *c.Addresses.Management, assetId)

	dataAddressPayload, err := createDataAddressFromInput(dataAddress)
	if err != nil {
		return err
	}

	assetDataAddress, err := json.Marshal(dataAddressPayload)
	if err != nil {
		return fmt.Errorf("unexpected error while marshaling create asset properties: %v", err)
	}

	req, err := http.NewRequest("PUT", dataAddressEndpoint, bytes.NewBuffer(assetDataAddress))
	if err != nil {
		return fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("error while performing GET request to the endpoint %v: %v", dataAddressEndpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, dataAddressEndpoint, response)
	}

	return nil
}
