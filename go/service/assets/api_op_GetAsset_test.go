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

func Test_GetAsset(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
{
	"createdAt": 1680172087972,
	"properties": {
		"asset:prop:name": "product description",
		"asset:prop:contenttype": "application/json",
		"asset:prop:id": "1234"
	},
	"id": "1234"
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
	asset, err := apiClient.GetAsset(assetId)

	assert.NoError(t, err, "failed to create asset.")
	assert.NotNil(t, asset)
	assert.Equal(t, asset.AssetProperties["asset:prop:name"], "product description")
	assert.Equal(t, asset.AssetProperties["asset:prop:contenttype"], "application/json")
	assert.Equal(t, asset.AssetProperties["asset:prop:id"], "1234")
	assert.Equal(t, asset.Id, "1234")
	assert.Equal(t, asset.CreatedAt, int64(1680172087972))
}

func Test_GetAssetDataAddress(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
{
	"properties": {
		"baseUrl": "https://jsonplaceholder.typicode.com/users",
		"name": "Test asset",
		"type": "HttpData"
	}
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
	asset, err := apiClient.GetAssetDataAddress(assetId)

	assert.NoError(t, err, "failed to create asset.")
	assert.NotNil(t, asset)
	assert.Equal(t, asset.AssetProperties["type"], "HttpData")
	assert.Equal(t, asset.AssetProperties["baseUrl"], "https://jsonplaceholder.typicode.com/users")
	assert.Equal(t, asset.AssetProperties["name"], "Test asset")
}
