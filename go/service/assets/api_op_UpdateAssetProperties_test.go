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
	"@context": {
		"edc": "https://w3id.org/edc/v0.0.1/ns/"
	},
	"@id": "1234",
	"edc:properties": {
		"edc:name": "new product description",
		"edc:contentType": "application/json"
	},
	"edc:privateProperties": {
		"codename": "sparta"
	}
}`, string(payload), "invalid payload")
		assert.Equal(t, "PUT", r.Method, "unexpected method")
		assert.Equal(t, "/assets", r.URL.Path)
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
	err = apiClient.UpdateAssetProperties(assetId, AssetProperties{
		PublicProperties: map[string]string{
			"edc:name":        "new product description",
			"edc:contentType": "application/json",
		},
		PrivateProperties: map[string]string{
			"codename": "sparta",
		},
	})
	assert.NoError(t, err, "failed to update asset.")
}
