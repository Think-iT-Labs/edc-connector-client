package policies

import (
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

type Addresses struct {
	Control    *string
	Management *string
	Protocol   *string
	Public     *string
	Default    *string
}

type Client struct {
	HTTPClient *edchttp.HTTPClient
	Addresses
	ErrorFactory *internal.ErrorFactory
}

func New(cfg edc.Config) (*Client, error) {
	client := &Client{
		HTTPClient:   cfg.HTTPClient,
		Addresses:    Addresses(cfg.Addresses),
		ErrorFactory: sdkErrors,
	}
	client.HTTPClient.ErrorFactory = sdkErrors
	return client, nil
}
