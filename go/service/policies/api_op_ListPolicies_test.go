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

	policies, apiError, err := apiClient.ListPolicies()

	assert.NoError(t, err, "failed to list policies.")
	assert.NotNil(t, policies)
	assert.Nil(t, apiError)
	assert.Equal(t, len(policies), 1)
	assert.Equal(t, policies[0].Id, "1234")
	assert.Equal(t, policies[0].CreatedAt, int64(1680172087972))
}

func Test_ListPoliciesInternalServerError(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500)
		fmt.Fprintf(w, `
[
	{
		"invalidValue": "internal server error",
		"message": "internal server error",
		"path": "/policydefinitions/request",
		"path": "POST"
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

	policies, apiError, err := apiClient.ListPolicies()

	assert.NoError(t, err, "failed to list policies.")
	assert.Nil(t, policies)
	assert.NotNil(t, apiError)
	assert.Equal(t, len(apiError), 1)
}
