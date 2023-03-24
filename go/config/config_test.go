package config

import (
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
	cfg := LoadConfig(token, addresses)

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
