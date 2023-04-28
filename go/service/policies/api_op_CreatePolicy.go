package policies

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
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
		return nil, internal.WrapErrorf(err, internal.ErrorCodeInternalError, "error marshalling policy") //fmt.Errorf("unexpected error while marshaling create policy input: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(createPolicyInputJson))
	if err != nil {
		return nil, internal.WrapErrorf(err, internal.ErrorCodeInternalError, "error building policy request") //fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, internal.WrapErrorf(err, internal.ErrorCodeInternalError, "error performing request to the endpoint") //fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, internal.WrapErrorf(err, internal.ErrorCodeInternalError, "error reading response") //fmt.Errorf("error while reading response body: %v", err)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 || res.StatusCode < 300
	if !statusOk {
		// The policies API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, internal.WrapErrorf(err, internal.ErrorCodeInternalError, "error while unmarshaling json") //fmt.Errorf("error while unmarshaling json: %v", err)
		}
		return nil, internal.NewErrorf(internal.ErrorCodeConnectorError, "error from connector: %+v", v[0])
	}

	err = json.Unmarshal(response, &createPolicyOutput)
	if err != nil {
		return nil, internal.WrapErrorf(err, internal.ErrorCodeInternalError, "error while unmarshaling json")
	}

	return &createPolicyOutput, nil
}
