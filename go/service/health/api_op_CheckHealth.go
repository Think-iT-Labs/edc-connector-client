package health

func (c *Client) performCheckHealth() (healthStatus *HealthStatus, err error) {
	healthStatus, err = c.performOperation(*c.Addresses.Default, "/check/health")
	return
}
