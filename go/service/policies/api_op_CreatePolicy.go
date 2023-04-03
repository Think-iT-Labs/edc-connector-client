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

func (c *Client) CreatePolicy(createPolicyInput CreatePolicyInput) (*CreatePolicyOutput, error) {
	endpoint := fmt.Sprintf("%v/policydefinitions", *c.Addresses.Management)
	createPolicyOutput := CreatePolicyOutput{}

	createPolicyInputJson, err := json.Marshal(createPolicyInput)

	if err != nil {
		return nil, fmt.Errorf("unexpected error while marshaling create policy input: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(createPolicyInputJson))
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	err = json.Unmarshal(response, &createPolicyOutput)
	if err != nil {
		return nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return &createPolicyOutput, err
}
