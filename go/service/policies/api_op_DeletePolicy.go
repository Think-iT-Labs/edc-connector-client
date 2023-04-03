package policies

import (
	"fmt"
	"net/http"
)

func (c *Client) DeletePolicy(policyId string) error {
	endpoint := fmt.Sprintf("%v/policydefinitions/%v", *c.Addresses.Management, policyId)

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
