package policies

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
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
	endpoint := fmt.Sprintf("%s/policydefinitions", *c.Addresses.Management)
	createPolicyOutput := CreatePolicyOutput{}

	createPolicyInputJson, err := json.Marshal(createPolicyInput)

	if err != nil {
		return nil, errors.Wrap(err).FailedTo("marshal json")
	}

	req, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewBuffer(createPolicyInputJson))
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("create http request")
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("perform request to the endpoint")
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("read response bytes")
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 || res.StatusCode < 300
	if !statusOk {
		// The policies API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, errors.Wrap(err).FailedTo("unmarshal json")
		}
		// TODO: can return more than 1 eleement in error array???
		return nil, errors.Wrap(v[0]).FailedTo("receive successful result from API")
	}

	err = json.Unmarshal(response, &createPolicyOutput)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("unmarshal json")
	}

	return &createPolicyOutput, nil
}
