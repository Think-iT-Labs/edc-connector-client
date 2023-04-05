package policies

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type CreatePolicyOutput struct {
	CreatedAt int64
	Id        string
}

type CreatePolicyInput struct {
	Id     *string `json:"id,omitempty"`
	Policy Policy  `json:"policy,omitempty"`
}

func (c *Client) CreatePolicy(createPolicyInput CreatePolicyInput) (*CreatePolicyOutput, []ApiErrorDetail, error) {
	endpoint := fmt.Sprintf("%v/policydefinitions", *c.Addresses.Management)
	createPolicyOutput := CreatePolicyOutput{}

	createPolicyInputJson, err := json.Marshal(createPolicyInput)

	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while marshaling create policy input: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(createPolicyInputJson))
	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, nil, fmt.Errorf("error while reading response body: %v", err)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		var v []ApiErrorDetail
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
		}
		return nil, v, nil
	}

	err = json.Unmarshal(response, &createPolicyOutput)
	if err != nil {
		return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return &createPolicyOutput, nil, err
}
