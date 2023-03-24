package health

func (c *Client) performCheckStartup() (healthStatus *HealthStatus, err error) {
	healthStatus, err = c.performOperation(*c.Addresses.Default, "/check/startup")
	return
}

