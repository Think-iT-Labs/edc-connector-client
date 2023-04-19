package contractdefinition

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func (c *Client) DeleteContractDefinition(cDefId string) error {
	endpoint := fmt.Sprintf("%v/contractdefinitions/%v", *c.Addresses.Management, cDefId)

	req, err := http.NewRequest("DELETE", endpoint, nil)
	if err != nil {
		return fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("error while performing DELETE request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("ERROR: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	return err
}
