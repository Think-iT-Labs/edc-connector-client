package observability

func (c *Client) performCheckReadiness() (healthStatus *HealthStatus, err error) {
	healthStatus, err = c.performOperation(*c.Addresses.Default, "/check/readiness")
	return
}

