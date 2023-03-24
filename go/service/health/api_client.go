package health

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
)

type Addresses struct {
	Control    *string
	Management *string
	Protocol   *string
	Public     *string
	Default    *string
}

type Client struct {
	HTTPClient *http.Client
  Addresses
}

type HealthCheckResult struct {
  Failure   *[]string `json:"failure"`
  Component *string `json:"component"`
  IsHealthy  bool `json:"isHealthy"`
}

type HealthStatus struct {
  IsSystemHealthy  bool `json:"isSystemHealthy"`
  ComponentResults []HealthCheckResult `json:"componentResults"`
}

func New(cfg edc.Config) *Client {
	client := &Client{
		HTTPClient: cfg.HTTPClient,
    Addresses: Addresses(cfg.Addresses),
	}
	return client
}

func (c *Client) performOperation(path, address string) (*HealthStatus, error) {
  hs := HealthStatus{}
  endpoint := address + path
  
  // TODO: Build our own http client and inject the token
  res, err := c.HTTPClient.Get(endpoint)
  if err != nil {
    return nil, fmt.Errorf("error while performing GET request to the endpoint %v: %v", endpoint, err)
  }
  
  defer res.Body.Close()
  healthStatus, err := ioutil.ReadAll(res.Body)
  if err != nil {
    return nil, fmt.Errorf("error while reading response body: %v", err)
  }

  err = json.Unmarshal(healthStatus, &hs)
  if err != nil {
    return nil, fmt.Errorf("error while unmarshaling json: %v", err)
  }

  return &hs, err
}
