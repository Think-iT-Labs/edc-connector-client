package config

import (
	"fmt"
	"log"
	"os"
	"reflect"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal/sdkuri"
)

const (
	authTokenEnv         = "CONNECTOR_AUTH_TOKEN"
	controlAddressEnv    = "CONNECTOR_CONTROL_ADDRESS"
	managementAddressEnv = "CONNECTOR_MANAGEMENT_ADDRESS"
	protocolAddressEnv   = "CONNECTOR_PROTOCOL_ADDRESS"
	publicAddressEnv     = "CONNECTOR_PUBLIC_ADDRESS"
	defaultAddressEnv    = "CONNECTOR_DEFAULT_ADDRESS"
)

func LoadConfig(token string, addresses edc.Addresses) (cfg *edc.Config, err error) {
	httpClient, err := edchttp.NewHTTPClient(&token)
	if err != nil {
		return nil, err
	}
	cfg = edc.NewConfig()
	cfg.AuthToken = token
	cfg.HTTPClient = httpClient
	cfg.Logger = &log.Logger{}
	err = validateConnectorAddresses(addresses)
	if err != nil {
		return nil, fmt.Errorf("error while validating connector addresses: %v", err)
	}
	cfg.Addresses = addresses
	return
}

func validateConnectorAddresses(addresses edc.Addresses) error {
	v := reflect.ValueOf(addresses)
	typeOfAddresses := v.Type()
	for i := 0; i < v.NumField(); i++ {
		if v.Field(i).IsNil() {
			return fmt.Errorf("%v address is missing", typeOfAddresses.Field(i).Name)
		}
		if !sdkuri.IsURIValid(v.Field(i).Elem().String()) {
			return fmt.Errorf("%v address is not a valid URI", typeOfAddresses.Field(i).Name)
		}

	}
	return nil
}

func loadConnectorAddressesFromEnv() (addresses *edc.Addresses, err error) {
	controlAddress, ok := os.LookupEnv(controlAddressEnv)
	if !ok {
		return nil, fmt.Errorf("connector control address not found")
	}

	managementAddress, ok := os.LookupEnv(managementAddressEnv)
	if !ok {
		return nil, fmt.Errorf("connector management address not found")
	}

	procotolAddress, ok := os.LookupEnv(protocolAddressEnv)
	if !ok {
		return nil, fmt.Errorf("connector protocol address not found")
	}

	publicAddress, ok := os.LookupEnv(publicAddressEnv)
	if !ok {
		return nil, fmt.Errorf("connector public address not found")
	}

	defaultAddress, ok := os.LookupEnv(defaultAddressEnv)
	if !ok {
		return nil, fmt.Errorf("connector default address not found")
	}

	addresses = &edc.Addresses{
		Control:    &controlAddress,
		Management: &managementAddress,
		Protocol:   &procotolAddress,
		Public:     &publicAddress,
		Default:    &defaultAddress,
	}
	return
}

func LoadDefaultConfig() (cfg *edc.Config, err error) {
	cfg = edc.NewConfig()
	token, ok := os.LookupEnv(authTokenEnv)
	if !ok {
		return nil, fmt.Errorf("connector auth token not found")
	}

	cfg.AuthToken = token

	connectorAddresses, err := loadConnectorAddressesFromEnv()
	if err != nil {
		return nil, err
	}
	err = validateConnectorAddresses(*connectorAddresses)
	if err != nil {
		return nil, fmt.Errorf("error while validating connector addresses: %v", err)
	}
	cfg.Addresses = *connectorAddresses
	httpClient, err := edchttp.NewHTTPClient(&token)
	if err != nil {
		return nil, err
	}
	cfg.HTTPClient = httpClient
	cfg.Logger = &log.Logger{}
	return
}
