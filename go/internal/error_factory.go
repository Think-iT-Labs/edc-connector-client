package internal

import (
	"errors"
	"fmt"
)

// ErrorFactory creates and wraps errors
type ErrorFactory struct {
	// the error that the factory produces. Can be nil
	defaultInternalError error
	// prefix will be prepended to all error messages returned by the factory
	prefix string
	// if True, factory exposes err as wrapError.Inner
	// Otherwise, factory.err would not be returned
	wrapping bool
}

// NewErrorFactory creates a new error factory with a given prefix.
// The prefix will be prepended to all errors returned by the factory.
func NewErrorFactory(prefix string) *ErrorFactory {
	return &ErrorFactory{
		prefix: fmt.Sprintf("%s: ", prefix),
	}
}

// Error behaves like errors.New() but prepends the factory prefix
// to the error message
func (f *ErrorFactory) Error(text string) error {
	return f.wrap(errors.New(f.prefix + text))
}

// Errorf behaves like fmt.Errorf() but prepends the factory prefix
// to the error message
func (f *ErrorFactory) Errorf(format string, a ...interface{}) error {
	return fmt.Errorf(f.prefix+format, a...)
}

// FromError returns a derived Factory that wraps the given errors in all
// errors created.
func (f *ErrorFactory) FromError(err error) *ErrorFactory {
	return &ErrorFactory{
		defaultInternalError: err,
		prefix:               f.prefix,
		wrapping:             true,
	}
}

// FailedTo returns an error with a message "failed to <action>".
func (f *ErrorFactory) FailedTo(action string) error {
	return f.wrap(f.Errorf("failed to %s", action))
}

// FailedTof behaves like Errorf but prepends "failed to".
func (f *ErrorFactory) FailedTof(format string, a ...interface{}) error {
	messagef := fmt.Sprintf("failed to %s", format)
	return f.wrap(f.Errorf(messagef, a...))
}

// wraps factory's internal error with given err
func (f *ErrorFactory) wrap(err error) error {
	if !f.wrapping {
		return err
	}
	if f.defaultInternalError == nil {
		return nil
	}
	return &wrapError{
		inner: f.defaultInternalError,
		outer: err,
	}
}
