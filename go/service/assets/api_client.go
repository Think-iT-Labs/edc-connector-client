package assets

import (
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

var sdkErrors = internal.NewErrorFactory("assets")

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
	client.HTTPClient.ErrorFactory = sdkErrors
	return client, nil
}
