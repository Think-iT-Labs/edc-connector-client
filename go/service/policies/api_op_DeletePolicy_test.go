package policies

import (
	errlib "errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
	"github.com/stretchr/testify/assert"
)

func Test_DeletePolicy(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, ``)
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

	policyId := "1234"
	err = apiClient.DeletePolicy(policyId)

	assert.NoError(t, err, "failed to delete policy.")
}

func Test_DeletePolicyInternalServerError(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500)
		fmt.Fprintf(w, `
[
	{
		"invalidValue": "internal server error",
		"message": "internal server error",
		"path": "/policydefinitions/1234",
		"path": "DELETE"
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

	err = apiClient.DeletePolicy("1234")

	assert.NotNil(t, err)

	innerError := errlib.Unwrap(err)
	assert.IsTypef(t, internal.ConnectorApiError{}, innerError, "error should be of type  internal.ConnectorApiError")
}
