package assets

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func Test_ListAssets(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
[
	{
		"createdAt": 1680172087972,
		"properties": {
		  "asset:prop:name": "product description",
		  "asset:prop:contenttype": "application/json",
		  "asset:prop:id": "1234"
		},
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

	assets, err := apiClient.ListAssets()

	assert.NoError(t, err, "failed to list asset.")
	assert.NotNil(t, assets)
	assert.Equal(t, len(assets), 1)
	assert.Equal(t, assets[0].PublicProperties["asset:prop:name"], "product description")
	assert.Equal(t, assets[0].PublicProperties["asset:prop:contenttype"], "application/json")
	assert.Equal(t, assets[0].PublicProperties["asset:prop:id"], "1234")
	assert.Equal(t, assets[0].Id, "1234")
	// assert.Equal(t, assets[0].CreatedAt, int64(1680172087972)) //not returned by the API for now. bug???
}
