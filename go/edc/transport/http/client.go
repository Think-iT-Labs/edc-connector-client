package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

// HTTPClient interface
type HTTPClient struct {
	client       *http.Client
	bearerToken  *string
	ErrorFactory *internal.ErrorFactory
}

func NewHTTPClient(bearerToken *string) (*HTTPClient, error) {
	if bearerToken == nil {
		return nil, fmt.Errorf("bearer token should not be nil.")
	}
	return &HTTPClient{
		client:      &http.Client{},
		bearerToken: bearerToken,
	}, nil
}

func (c *HTTPClient) InvokeOperation(options internal.InvokeHTTPOperationOptions) error {
	var req *http.Request
	var err error
	if options.RequestPayload != nil {
		input, err := json.Marshal(options.RequestPayload)

		if err != nil {
			return c.ErrorFactory.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
		}

		req, err = http.NewRequest(options.Method, options.Endpoint, bytes.NewBuffer(input))
	} else {
		req, err = http.NewRequest(options.Method, options.Endpoint, nil)
	}

	if err != nil {
		return c.ErrorFactory.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.Do(req)
	if err != nil {
		return c.ErrorFactory.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)

	if err != nil {
		return c.ErrorFactory.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != options.ExpectedStatusCode {
		return c.ErrorFactory.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	if options.ResponsePayload != nil {
		err = json.Unmarshal(response, options.ResponsePayload)
		if err != nil {
			return c.ErrorFactory.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
	}

	return nil
}

func (h *HTTPClient) Do(req *http.Request) (*http.Response, error) {
	req.Header.Add("X-Api-Key", *h.bearerToken)
	req.Header.Add("Content-Type", "application/json")
	return h.client.Do(req)
}
