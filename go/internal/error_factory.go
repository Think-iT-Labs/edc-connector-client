package internal

import (
	"errors"
	"fmt"
)

// ErrorFactory creates and wraps errors
type ErrorFactory struct {
	err      error
	prefix   string
	wrapping bool
}

// NewErrorFactory creates a new error factory with a given prefix.
// The prefix will be prepended to all errors returned by the factory.
func NewErrorFactory(prefix string) *ErrorFactory {
	return &ErrorFactory{
		prefix: fmt.Sprintf("%s: ", prefix),
	}
}

func (f *ErrorFactory) Error(text string) error {
	return f.wrap(errors.New(f.prefix + text))
}

func (f *ErrorFactory) Errorf(format string, a ...interface{}) error {
	return fmt.Errorf(f.prefix+format, a...)
}

// FromError returns a derived Factory that wraps the given errors in all
// errors created.
func (f *ErrorFactory) FromError(err error) *ErrorFactory {
	return &ErrorFactory{
		err:      err,
		prefix:   f.prefix,
		wrapping: true,
	}
}

// FailedTo returns an error with a message "failed to <action>".
func (f *ErrorFactory) FailedTo(action string) error {
	return f.wrap(f.Errorf("failed to %s", action))
}

// FailedTof behaves like Errorf but prepends "failed to".
func (f *ErrorFactory) FailedTof(format string, a ...interface{}) error {
	return f.Errorf("failed to "+format, a...)
}

func (f *ErrorFactory) wrap(err error) error {
	if !f.wrapping {
		return err
	}
	if f.err == nil {
		return nil
	}
	return &wrapError{
		inner: f.err,
		outer: err,
	}
}
