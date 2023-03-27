package config

import (
	"fmt"
	"os"
	"reflect"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
)

func TestLoadConfig(t *testing.T) {
	token := "randomToken"
	defaultAddress := "https://edc.think-it.io/api"
	managementAddress := "https://edc.think-it.io/api/v1/data"
	protocolAddress := "https://edc.think-it.io/api/v1/ids"
	publicAddress := "https://edc.think-it.io/public"
	controlAddress := "https://edc.think-it.io/control"

	addresses := edc.Addresses{
		Default:    &defaultAddress,
		Management: &managementAddress,
		Protocol:   &protocolAddress,
		Public:     &publicAddress,
		Control:    &controlAddress,
	}
	cfg, err := LoadConfig(token, addresses)

	if err != nil {
		t.Fatalf("configuration loading failed with error %v", err)
	}

	if cfg.AuthToken != token {
		t.Fatalf("auth token is not correct, expected %v got %v", token, cfg.AuthToken)
	}

	if cfg.Addresses.Default != &defaultAddress {
		t.Fatalf("default address is not correct, expected %v got %v", defaultAddress, cfg.Addresses.Default)
	}

	if cfg.Addresses.Management != &managementAddress {
		t.Fatalf("management address is not correct, expected %v got %v", managementAddress, cfg.Addresses.Management)
	}

	if cfg.Addresses.Protocol != &protocolAddress {
		t.Fatalf("protocol address is not correct, expected %v got %v", protocolAddress, cfg.Addresses.Protocol)
	}

	if cfg.Addresses.Public != &publicAddress {
		t.Fatalf("public address is not correct, expected %v got %v", publicAddress, cfg.Addresses.Public)
	}

	if cfg.Addresses.Control != &controlAddress {
		t.Fatalf("control address is not correct, expected %v got %v", controlAddress, cfg.Addresses.Control)
	}
}

func TestValidateConnectorAddresses(t *testing.T) {
	controlAddress := "https://edc.think-it.io/control"
	defaultAddress := "https://edc.think-it.io/api"
	managementAddress := "https://edc.think-it.io/api/v1/data"
	protocolAddress := "https://edc.think-it.io/api/v1/ids"
	publicAddress := "https://edc.think-it.io/public"

	invalidControlAddress := "edc.think-it.io/control"

	testCases := map[string]struct {
		addresses     edc.Addresses
		expectedError error
	}{
		"valid addresses": {
			addresses: edc.Addresses{
				Control:    &controlAddress,
				Default:    &defaultAddress,
				Management: &managementAddress,
				Protocol:   &protocolAddress,
				Public:     &publicAddress,
			},
			expectedError: nil,
		},
		"invalid control addresses": {
			addresses: edc.Addresses{
				Control:    &invalidControlAddress,
				Default:    &defaultAddress,
				Management: &managementAddress,
				Protocol:   &protocolAddress,
				Public:     &publicAddress,
			},
			expectedError: fmt.Errorf("Control address is not a valid URI"),
		},
		"nil control addresses": {
			addresses: edc.Addresses{
				Default:    &defaultAddress,
				Management: &managementAddress,
				Protocol:   &protocolAddress,
				Public:     &publicAddress,
			},
			expectedError: fmt.Errorf("Control address is missing"),
		},
	}
	for testName, testValues := range testCases {
		t.Run(testName, func(t *testing.T) {
			err := validateConnectorAddresses(testValues.addresses)
			if !isErrorEqual(err, testValues.expectedError) {
				t.Errorf("unexpected error, expected %v got: %v", err, testValues.expectedError)
			}
		})
	}
}

func TestLoadConnectorAddressesFromEnv(t *testing.T) {
	controlAddress := "https://edc.think-it.io/control"
	defaultAddress := "https://edc.think-it.io/api"
	managementAddress := "https://edc.think-it.io/api/v1/data"
	protocolAddress := "https://edc.think-it.io/api/v1/ids"
	publicAddress := "https://edc.think-it.io/public"
	testCases := map[string]struct {
		envKeys           []string
		envValues         []string
		expectedError     error
		expectedAddresses *edc.Addresses
	}{
		"control address missing": {
			envKeys:           []string{managementAddressEnv, protocolAddressEnv, publicAddressEnv, defaultAddressEnv},
			envValues:         []string{managementAddress, protocolAddress, publicAddress, defaultAddress},
			expectedError:     fmt.Errorf("connector control address not found"),
			expectedAddresses: nil,
		},
		"default address missing": {
			envKeys:           []string{managementAddressEnv, protocolAddressEnv, publicAddressEnv, controlAddressEnv},
			envValues:         []string{managementAddress, protocolAddress, publicAddress, controlAddress},
			expectedError:     fmt.Errorf("connector default address not found"),
			expectedAddresses: nil,
		},
		"management address missing": {
			envKeys:           []string{controlAddressEnv, protocolAddressEnv, publicAddressEnv, defaultAddressEnv},
			envValues:         []string{controlAddress, protocolAddress, publicAddress, defaultAddress},
			expectedError:     fmt.Errorf("connector management address not found"),
			expectedAddresses: nil,
		},
		"protocol address missing": {
			envKeys:           []string{managementAddressEnv, controlAddressEnv, publicAddressEnv, defaultAddressEnv},
			envValues:         []string{managementAddress, controlAddress, publicAddress, defaultAddress},
			expectedError:     fmt.Errorf("connector protocol address not found"),
			expectedAddresses: nil,
		},
		"public address missing": {
			envKeys:           []string{managementAddressEnv, protocolAddressEnv, controlAddressEnv, defaultAddressEnv},
			envValues:         []string{managementAddress, protocolAddress, controlAddress, defaultAddress},
			expectedError:     fmt.Errorf("connector public address not found"),
			expectedAddresses: nil,
		},
		"all addresses are added": {
			envKeys:       []string{managementAddressEnv, protocolAddressEnv, publicAddressEnv, defaultAddressEnv, controlAddressEnv},
			envValues:     []string{managementAddress, protocolAddress, publicAddress, defaultAddress, controlAddress},
			expectedError: nil,
			expectedAddresses: &edc.Addresses{
				Control:    &controlAddress,
				Management: &managementAddress,
				Protocol:   &protocolAddress,
				Default:    &defaultAddress,
				Public:     &publicAddress,
			},
		},
	}
	for testName, testValues := range testCases {
		t.Run(testName, func(t *testing.T) {
			for i, key := range testValues.envKeys {
				os.Setenv(key, testValues.envValues[i])
			}
			defer func() {
				for _, key := range testValues.envKeys {
					os.Unsetenv(key)
				}
			}()
			addresses, err := loadConnectorAddressesFromEnv()
			if !isErrorEqual(err, testValues.expectedError) {
				t.Errorf("unexpected error, expected %v got: %v", err, testValues.expectedError)
			}
			if !reflect.DeepEqual(addresses, testValues.expectedAddresses) {
				t.Errorf("unexpected addresses value, expected %v got: %v", addresses, testValues.expectedAddresses)
			}
		})
	}
}

func TestLoadDefaultConfig(t *testing.T) {
	controlAddress := "https://edc.think-it.io/control"
	defaultAddress := "https://edc.think-it.io/api"
	managementAddress := "https://edc.think-it.io/api/v1/data"
	protocolAddress := "https://edc.think-it.io/api/v1/ids"
	publicAddress := "https://edc.think-it.io/public"
	authToken := "dummy"

	envKeys := []string{managementAddressEnv, protocolAddressEnv, publicAddressEnv, defaultAddressEnv, controlAddressEnv, authTokenEnv}
	envValues := []string{managementAddress, protocolAddress, publicAddress, defaultAddress, controlAddress, authToken}

	expectedAddresses := edc.Addresses{
		Control:    &controlAddress,
		Management: &managementAddress,
		Protocol:   &protocolAddress,
		Public:     &publicAddress,
		Default:    &defaultAddress,
	}

	for i, key := range envKeys {
		os.Setenv(key, envValues[i])
	}
	defer func() {
		for _, key := range envKeys {
			os.Unsetenv(key)
		}
	}()

	cfg, err := LoadDefaultConfig()
	if err != nil {
		t.Errorf("unexpected error, expected nil got: %v", err)
	}
	if cfg.AuthToken != authToken {
		t.Errorf("unexpected auth token, expected %v got: %v", cfg.AuthToken, authToken)
	}
	if cfg.HTTPClient != nil {
		t.Errorf("http client should not be nil")
	}
	if cfg.Logger != nil {
		t.Errorf("logger should not be nil")
	}
	if !reflect.DeepEqual(expectedAddresses, cfg.Addresses) {
		t.Errorf("unexpected addresses value, expected %v got: %v", expectedAddresses, cfg.Addresses)
	}
}

func isErrorEqual(err1 error, err2 error) bool {
	if err1 == nil && err2 == nil {
		return true
	}
	if err1 == nil {
		return false
	}
	if err1.Error() == err2.Error() {
		return true
	}
	return false
}
