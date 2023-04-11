package http

import (
	"fmt"
	"net/http"
)

// HTTPClient interface
type HTTPClient struct {
	client      *http.Client
	bearerToken *string
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

func (h *HTTPClient) Do(req *http.Request) (*http.Response, error) {
	req.Header.Add("X-Api-Key", *h.bearerToken)
	req.Header.Add("Content-Type", "application/json")
	return h.client.Do(req)
}
