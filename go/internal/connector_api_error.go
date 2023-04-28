package internal

import "fmt"

// ConnectorApiError represents an error that is returned from the connector API
type ConnectorApiError struct {
	InvalidValue string `json:"invalidValue,omitempty"`
	Message      string `json:"message,omitempty"`
	Path         string `json:"path,omitempty"`
	Type         string `json:"type,omitempty"`
}

func (e ConnectorApiError) Error() string {
	return fmt.Sprintf("{InvalidValue: %s, Message: %s, Path: %s Type: %s}", e.InvalidValue, e.Message, e.Path, e.Type) //fmt.Errorf("%s", e)
}
