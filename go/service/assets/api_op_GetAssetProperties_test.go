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

func Test_GetAssetProperties(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
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

	assetId := "1234"
	asset, err := apiClient.GetAssetProperties(assetId)

	assert.NoError(t, err, "failed to create asset.")
	assert.NotNil(t, asset)
	assert.Equal(t, "product description", asset.PublicProperties["edc:name"])
	assert.Equal(t, "application/json", asset.PublicProperties["edc:contenttype"])
	assert.Equal(t, "1234", asset.PublicProperties["edc:id"])
	assert.Equal(t, "1234", asset.Id)
	// assert.Equal(t, asset.CreatedAt, int64(1680172087972))
}
