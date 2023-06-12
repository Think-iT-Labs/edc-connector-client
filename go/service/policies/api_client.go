package policies

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

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
}

func (c *Client) invokeOperation(options internal.InvokeHTTPOperationOptions) error {
	var req *http.Request
	var err error
	if options.RequestPayload != nil {
		input, err := json.Marshal(options.RequestPayload)

		if err != nil {
			return sdkErrors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
		}

		req, err = http.NewRequest(options.Method, options.Endpoint, bytes.NewBuffer(input))
	} else {
		req, err = http.NewRequest(options.Method, options.Endpoint, nil)
	}

	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)

	if err != nil {
		return sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != options.ExpectedStatusCode {
		return sdkErrors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	if options.ResponsePayload != nil {
		err = json.Unmarshal(response, options.ResponsePayload)
		if err != nil {
			return sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
	}

	return nil
}

func New(cfg edc.Config) (*Client, error) {
	client := &Client{
		HTTPClient: cfg.HTTPClient,
		Addresses:  Addresses(cfg.Addresses),
	}
	return client, nil
}
