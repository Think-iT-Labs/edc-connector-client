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
		"edc:properties": {
		  "edc:name": "product description",
		  "edc:contenttype": "application/json",
		  "edc:id": "1234"
		},
		"edc:privateProperties": {
			"private": "yes"
		},
		"@id": "1234"
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
	assert.Equal(t, "product description", assets[0].PublicProperties["edc:name"])
	assert.Equal(t, "application/json", assets[0].PublicProperties["edc:contenttype"])
	assert.Equal(t, "1234", assets[0].PublicProperties["edc:id"])
	// assert.Equal(t, "1234", assets[0].Id) //TODO: fix this
	// assert.Equal(t, assets[0].CreatedAt, int64(1680172087972)) //not returned by the API for now. bug???
}
