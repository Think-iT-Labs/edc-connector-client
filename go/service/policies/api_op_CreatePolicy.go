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
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewBuffer(createPolicyInputJson))
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 || res.StatusCode < 300
	if !statusOk {
		return nil, errors.FromError(internal.ParseConnectorApiError(response)).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	err = json.Unmarshal(response, &createPolicyOutput)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
	}

	return &createPolicyOutput, nil
}
