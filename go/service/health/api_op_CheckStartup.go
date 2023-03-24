package health

type CheckHealthOutput struct {
	StatusCode int
	Message    string
}

func (c *Client) performCheckStartup() (err error) {
	return nil
}
