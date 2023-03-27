package http

import (
	"fmt"
	"testing"
)

func TestNewHttpClient(t *testing.T) {
	validToken := "dummy"
	client, err := NewHTTPClient(&validToken)
	if err != nil {
		t.Errorf("invalid error, expected nil got %v", err)
	}
	if client.bearerToken != &validToken {
		t.Errorf("invalid token, expected %v got %v", validToken, client.bearerToken)
	}

	client, err = NewHTTPClient(nil)
	if err == nil {
		t.Errorf("invalid error, expected %v got %v", fmt.Errorf("bearer token should not be nil."), err)
	}
}
