package health

type CheckHealthOutput struct {
	StatusCode int
	Message    string
}

func (c *Client) performCheckLiveness() (err error) {
	return nil
}
