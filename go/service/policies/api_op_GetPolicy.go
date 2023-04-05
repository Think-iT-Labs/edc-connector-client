package policies

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func (c *Client) GetPolicy(policyId string) (*PolicyDefinition, []ApiErrorDetail, error) {
	endpoint := fmt.Sprintf("%v/policydefinitions/%v", *c.Addresses.Management, policyId)
	policyDefinition := PolicyDefinition{}

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, nil, fmt.Errorf("error while performing GET request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, nil, fmt.Errorf("error while reading response body: %v", err)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	if res.StatusCode >= 400 {
		var v []ApiErrorDetail
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
		}
		return nil, v, nil
	}

	err = json.Unmarshal(response, &policyDefinition)
	if err != nil {
		return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return &policyDefinition, nil, err
}
