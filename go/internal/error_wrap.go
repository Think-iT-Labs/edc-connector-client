package internal

import "fmt"

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
