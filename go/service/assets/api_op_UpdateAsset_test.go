package assets

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func Test_UpdateAssetProperties(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"properties": {
		"asset:prop:name": "product description",
		"asset:prop:contenttype": "application/json"
	}
}`, string(payload), "invalid payload")
		assert.Equal(t, "PUT", r.Method, "unexpected method")
		assert.Equal(t, "/assets/1234", r.URL.Path)
		w.WriteHeader(204)
		fmt.Fprintf(w, "")
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
	err = apiClient.UpdateAssetProperties(AssetApiInput{
		AssetProperties: map[string]string{
			"asset:prop:name":        "product description",
			"asset:prop:contenttype": "application/json",
		},
	}, assetId)
	assert.NoError(t, err, "failed to update asset.")
}

func Test_UpdateAssetDataAddress(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"properties": {
		"type":    "HttpData",
		"name":    "dummy asset server",
		"baseUrl": "http://dummy.dum"
	}
}`, string(payload), "invalid payload")
		assert.Equal(t, "PUT", r.Method, "unexpected method")
		assert.Equal(t, "/assets/1234/dataaddress", r.URL.Path)
		w.WriteHeader(204)
		fmt.Fprintf(w, "")
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
	httpName := "dummy asset server"
	httpBaseUrl := "http://dummy.dum"
	err = apiClient.UpdateAssetDataAddress(DataAddress{
		HttpDataAddress: &HttpData{
			Type:    "HttpData",
			Name:    &httpName,
			BaseUrl: &httpBaseUrl,
		},
	}, assetId)
	assert.NoError(t, err, "failed to update asset.")
}
