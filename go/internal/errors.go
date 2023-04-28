package internal

import "fmt"

type SdkError struct {
	msg  string
	orig error
}

func (e *SdkError) Error() string {
	return fmt.Sprintf(e.msg, e.orig)
}

var UNMARSHAL_ERROR = "error while unmarshaling json: %+v"
var MARSHALLING_ERROR = "error while marshalling json: %+v"

type ConnectorApiError struct {
	InvalidValue string `json:"invalidValue,omitempty"`
	Message      string `json:"message,omitempty"`
	Path         string `json:"path,omitempty"`
	Type         string `json:"type,omitempty"`
}

// Error represents an error that could be wrapping another error, it includes a code for determining what
// triggered the error.
type Error struct {
	orig error
	msg  string
	code ErrorCode
}

// ErrorCode defines supported error codes.
type ErrorCode uint

const (
	ErrorCodeUnknown ErrorCode = iota
	ErrorCodeConnectorError
	ErrorCodeInternalError
	ErrorCodeInvalidArgument
)

// WrapErrorf returns a wrapped error.
func WrapErrorf(orig error, code ErrorCode, format string, a ...interface{}) error {
	return &Error{
		code: code,
		orig: orig,
		msg:  fmt.Sprintf(format, a...),
	}
}

// NewErrorf instantiates a new error.
func NewErrorf(code ErrorCode, format string, a ...interface{}) error {
	return WrapErrorf(nil, code, format, a...)
}

// Error returns the message, when wrapping errors the wrapped error is returned.
func (e *Error) Error() string {
	if e.orig != nil {
		return fmt.Sprintf("%s: %v", e.msg, e.orig)
	}

	return e.msg
}

// Unwrap returns the wrapped error, if any.
func (e *Error) Unwrap() error {
	return e.orig
}

// Code returns the code representing this error.
func (e *Error) Code() ErrorCode {
	return e.code
}
