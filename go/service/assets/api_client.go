package assets

import (
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
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
}

func New(cfg edc.Config) (*Client, error) {
	client := &Client{
		HTTPClient: cfg.HTTPClient,
		Addresses:  Addresses(cfg.Addresses),
	}
	return client, nil
}
