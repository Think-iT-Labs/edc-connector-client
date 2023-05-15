package internal

import "fmt"

// wrapError represents an error that wraps another error
// eg: wrapError{outer: "unmarshal json", inner: "unexpected ',' at 13:10"}
type wrapError struct {
	// inner is the original error
	inner error
	// outer is the outer layer
	outer error
}

func (w *wrapError) Error() string {
	return fmt.Sprintf("%v: %v", w.outer, w.inner)
}

func (w *wrapError) Unwrap() error {
	return w.inner
}
