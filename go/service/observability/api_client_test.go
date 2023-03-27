package observability

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	config "github.com/Think-iT-Labs/edc-connector-client/go/config"
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func TestNewClient(t *testing.T) {
	controlAddress := "https://edc.think-it.io/control"
	defaultAddress := "https://edc.think-it.io/api"
	managementAddress := "https://edc.think-it.io/api/v1/data"
	protocolAddress := "https://edc.think-it.io/api/v1/ids"
	publicAddress := "https://edc.think-it.io/public"
	authToken := "dummy"

	cfg, err := config.LoadConfig(authToken, edc.Addresses{
		Default:    &defaultAddress,
		Control:    &controlAddress,
		Management: &managementAddress,
		Protocol:   &protocolAddress,
		Public:     &publicAddress,
	})

	if err != nil {
		t.Errorf("invalid error, expected nil got %v", err)
	}

	_, err = New(*cfg)
	if err != nil {
		t.Errorf("invalid error, expected nil got %v", err)
	}
}

func TestPerformCheckHealth(t *testing.T) {
	token := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
{
	"componentResults": [
		{
			"failure": null,
			"component": null,
			"isHealthy": true
		}
	],
	"isSystemHealthy": true
}		
`)
	}))
	defer svr.Close()

	cfg := edc.NewConfig()

	cfg.Addresses = edc.Addresses{
		Default: &svr.URL,
	}
	httpClient, err := edchttp.NewHTTPClient(&token)
	assert.Nil(t, err)
	cfg.HTTPClient = httpClient

	apiClient, err := New(*cfg)
	if err != nil {
		t.Errorf("invalid error, expected nil got %v", err)
	}

	healthStatus, err := apiClient.performCheckHealth()
	assert.Nil(t, err)
	assert.True(t, healthStatus.IsSystemHealthy)
	assert.True(t, healthStatus.ComponentResults[0].IsHealthy)
	assert.Nil(t, healthStatus.ComponentResults[0].Failure)
	assert.Nil(t, healthStatus.ComponentResults[0].Component)

	healthStatus, err = apiClient.performCheckReadiness()
	assert.Nil(t, err)
	assert.True(t, healthStatus.IsSystemHealthy)
	assert.True(t, healthStatus.ComponentResults[0].IsHealthy)
	assert.Nil(t, healthStatus.ComponentResults[0].Failure)
	assert.Nil(t, healthStatus.ComponentResults[0].Component)

	healthStatus, err = apiClient.performCheckLiveness()
	assert.Nil(t, err)
	assert.True(t, healthStatus.IsSystemHealthy)
	assert.True(t, healthStatus.ComponentResults[0].IsHealthy)
	assert.Nil(t, healthStatus.ComponentResults[0].Failure)
	assert.Nil(t, healthStatus.ComponentResults[0].Component)

	healthStatus, err = apiClient.performCheckStartup()
	assert.Nil(t, err)
	assert.True(t, healthStatus.IsSystemHealthy)
	assert.True(t, healthStatus.ComponentResults[0].IsHealthy)
	assert.Nil(t, healthStatus.ComponentResults[0].Failure)
	assert.Nil(t, healthStatus.ComponentResults[0].Component)
}
