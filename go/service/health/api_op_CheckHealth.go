package health

type CheckHealthOutput struct {
	StatusCode int
	Message    string
}

func (c *Client) performCheckHealth() (err error) {
	return nil
}
