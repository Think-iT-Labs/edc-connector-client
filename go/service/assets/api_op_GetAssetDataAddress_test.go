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

func Test_GetAssetDataAddress(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
{
		"edc:baseUrl": "https://jsonplaceholder.typicode.com/users",
		"edc:name": "Test asset",
		"edc:type": "HttpData"
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
	dataAddress, err := apiClient.GetAssetDataAddress(assetId)

	assert.NoError(t, err, "failed to get asset Data Address .")
	assert.NotNil(t, dataAddress)
	assert.Equal(t, DataAddressTypeHttp, dataAddress.(HttpData).Type)
	assert.Equal(t, "https://jsonplaceholder.typicode.com/users", dataAddress.(HttpData).BaseUrl)
	assert.Equal(t, "Test asset", dataAddress.(HttpData).HttpAssetName)
}
