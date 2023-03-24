package config

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
)

const (
	authToken         = "CONNECTOR_AUTH_TOKEN"
	controlAddress    = "CONNECTOR_CONTROL_ADDRESS"
	managementAddress = "CONNECTOR_MANAGEMENT_ADDRESS"
	protocolAddress   = "CONNECTOR_PROTOCOL_ADDRESS"
	publicAddress     = "CONNECTOR_PUBLIC_ADDRESS"
	defaultAddress    = "CONNECTOR_DEFAULT_ADDRESS"
)

func LoadConfig(token string, addresses edc.Addresses) (cfg *edc.Config) {
	cfg = edc.NewConfig()
	cfg.AuthToken = token
	cfg.HTTPClient = &http.Client{}
	cfg.Logger = &log.Logger{}
	cfg.Addresses = addresses
	return
}

func LoadDefaultConfig() (cfg *edc.Config, err error) {
	token, ok := os.LookupEnv(authToken)
	if !ok {
		return nil, fmt.Errorf("auth token not found")
	}

	cfg.AuthToken = token

	cfg.Addresses = edc.Addresses{}

	cfg.HTTPClient = &http.Client{}
	cfg.Logger = &log.Logger{}
	return
}
