package policies

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func Test_ListPolicies(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
[
	{
		"createdAt": 1680172087972,
		"policy": {},
		"id": "1234"
	  }
]
`)
	}))
	defer svr.Close()

	cfg := edc.NewConfig()

	cfg.Addresses = edc.Addresses{
		Management: &svr.URL,
	}
	httpClient, err := edchttp.NewHTTPClient(&authToken)
	assert.NoError(t, err, "failed to initialize Http Client")
	cfg.HTTPClient = httpClient

	apiClient, err := New(*cfg)
	assert.NoError(t, err, "failed to initialize api client")

	policies, err := apiClient.ListPolicies(ListPoliciesInput{})

	assert.NoError(t, err, "failed to create asset.")
	assert.NotNil(t, policies)
	assert.Equal(t, len(policies), 1)
	assert.Equal(t, policies[0].Id, "1234")
	assert.Equal(t, policies[0].CreatedAt, int64(1680172087972))
}
