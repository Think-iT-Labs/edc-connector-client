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

func Test_CreateAsset(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"asset": {
		"properties": {
			"asset:prop:id": "1234",
			"asset:prop:name": "product description",
			"asset:prop:contenttype": "application/json"
		}
	},
	"dataAddress": {
		"properties": {
			"name": "Test asset",
			"baseUrl": "https://jsonplaceholder.typicode.com/users",
			"type": "HttpData"
		}
	}
}`, string(payload), "invalid payload")

		fmt.Fprintf(w, `
{
	"createdAt": 1680004526,
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

	assetName := "Test asset"
	assetBaseUrl := "https://jsonplaceholder.typicode.com/users"
	assetId := "1234"
	createAssetOutput, err := apiClient.CreateAsset(
		AssetProperties{
			PublicProperties: map[string]string{
				"asset:prop:id":          assetId,
				"asset:prop:name":        "product description",
				"asset:prop:contenttype": "application/json",
			},
		},
		HttpData{
			HttpAssetName: assetName,
			BaseUrl:       assetBaseUrl,
		},
	)
	assert.NoError(t, err, "failed to create asset.")
	assert.Equal(t, createAssetOutput.Id, assetId)
}

func Test_CreateAssetWithCustomDataAddress(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"asset": {
		"properties": {
			"asset:prop:id": "1234",
			"asset:prop:name": "product description",
			"asset:prop:contenttype": "application/json"
		}
	},
	"dataAddress": {
		"properties": {
			"name": "This is custom Address",
			"customKey": "This is custom key"
		}
	}
}`, string(payload), "invalid payload")

		fmt.Fprintf(w, `
{
	"createdAt": 1680004526,
	"id": "1234"
}`)
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

	customDataAddress := CustomData{
		"name":      "This is custom Address",
		"customKey": "This is custom key",
	}
	assetId := "1234"
	createAssetOutput, err := apiClient.CreateAsset(
		AssetProperties{
			PublicProperties: map[string]string{
				"asset:prop:id":          assetId,
				"asset:prop:name":        "product description",
				"asset:prop:contenttype": "application/json",
			},
		},
		customDataAddress,
	)
	assert.NoError(t, err, "failed to create asset.")
	assert.Equal(t, createAssetOutput.Id, assetId)
}
