package internal

import (
	"encoding/json"
	"fmt"
)

// ConnectorApiError represents an error that is returned from the connector API
type ConnectorApiError struct {
	InvalidValue string `json:"invalidValue,omitempty"`
	Message      string `json:"message,omitempty"`
	Path         string `json:"path,omitempty"`
	Type         string `json:"type,omitempty"`
}

func (e ConnectorApiError) Error() string {
	return fmt.Sprintf("{InvalidValue: %s, Message: %s, Path: %s Type: %s}", e.InvalidValue, e.Message, e.Path, e.Type)
}

func ParseConnectorApiError(response []byte) error {
	// The connector API returns error in an array.
	var apiErrors ConnectorApiErrors
	err := json.Unmarshal(response, &apiErrors)
	if err != nil {
		return &wrapError{
			outer: fmt.Errorf("failed to: %s", ACTION_JSON_UNMARSHAL),
			inner: err,
		}
	}
	return apiErrors
}

type ConnectorApiErrors []ConnectorApiError

func (es ConnectorApiErrors) Error() string {
	var msg string
	for _, e := range es {
		msg = msg + " " + e.Error()
	}
	return fmt.Sprintf("[ " + msg + " ]")
}
