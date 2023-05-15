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

// ParseConnectorApiError reads the HTTP response
// and parses it to read the ConnectorApiErrors within
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
	if len(es) == 1 {
		msg = fmt.Sprintf("[%s]", es[0].Error())
	} else {
		for _, e := range es {
			msg = msg + fmt.Sprintf("%s,\n", e.Error())
		}
		msg = fmt.Sprintf("[\n%s]", msg)
	}
	return msg
}
