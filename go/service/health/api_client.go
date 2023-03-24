package health

import (
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
)

type Client struct {
	HTTPClient *http.Client
}

type HealthCheckResult struct {
	Failure   *[]string
	Component *string
	IsHealth  bool
}

type HealthStatus struct {
	IsSystemHealthy  bool
	ComponentResults []HealthCheckResult
}

func New(cfg edc.Config) *Client {
	client := &Client{
		HTTPClient: cfg.HTTPClient,
	}
	return client
}

func (c *Client) performOperation(path string) HealthCheckResult {

}
