package health

type CheckHealthOutput struct {
	StatusCode int
	Message    string
}

func (c *Client) performCheckReadiness() (err error) {
	return nil
}
