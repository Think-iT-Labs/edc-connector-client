package contractdefinition

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func Test_UpdateContractDefinition(t *testing.T) {
	// init mocking server
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
		w.Write([]byte(""))
	}))
	defer svr.Close()

	// init http client
	authToken := "dummy-token"
	httpClient, err := edchttp.NewHTTPClient(&authToken)
	assert.NoError(t, err, "failed to initialize Http Client")

	// init edc client
	cfg := edc.NewConfig()
	cfg.Addresses = edc.Addresses{
		Management: &svr.URL,
	}
	cfg.HTTPClient = httpClient
	apiClient, err := New(*cfg)

	// check client is initialized Correctly
	assert.NoError(t, err, "failed to initialize api client")

	err = apiClient.UpdateContractDefinition(
		ContractDefinition{
			Id: "dummy",
		},
	)

	// Check operation success
	assert.NoError(t, err, "failed to perform Contract Definition DELETE")
}
