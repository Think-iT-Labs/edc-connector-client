package internal

import "fmt"

// wrapError represents an error that wraps another error
// inner is the original error
// outer is the outer layer
// eg: wrapError{outer: "unmarshal json", inner: "unexpected ',' at 13:10"}
type wrapError struct {
	inner error
	outer error
}

func (w *wrapError) Error() string {
	return fmt.Sprintf("%v: %v", w.outer, w.inner)
}

func (w *wrapError) Unwrap() error {
	return w.inner
}
