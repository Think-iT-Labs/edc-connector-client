package policies

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func (c *Client) DeletePolicy(policyId string) ([]ApiErrorDetail, error) {
	endpoint := fmt.Sprintf("%v/policydefinitions/%v", *c.Addresses.Management, policyId)

	req, err := http.NewRequest("DELETE", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing DELETE request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		var v []ApiErrorDetail
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, fmt.Errorf("error while unmarshaling json: %v", err)
		}
		return v, nil
	}

	return nil, err
}
