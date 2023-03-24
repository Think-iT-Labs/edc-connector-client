package health

func (c *Client) performCheckLiveness() (healthStatus *HealthStatus, err error) {
	healthStatus, err = c.performOperation(*c.Addresses.Default, "/check/liveness")
	return
}
