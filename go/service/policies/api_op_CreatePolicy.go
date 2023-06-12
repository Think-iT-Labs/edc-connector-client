package policies

import (
	"fmt"
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
	createPolicyOutput := &CreatePolicyOutput{}

	if err := c.invokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodPost,
		Endpoint:           endpoint,
		RequestPayload:     createPolicyInput,
		ResponsePayload:    createPolicyOutput,
		ExpectedStatusCode: http.StatusOK,
	}); err != nil {
		return nil, err
	}

	return createPolicyOutput, nil
}
