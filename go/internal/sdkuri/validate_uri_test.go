package sdkuri

import (
	"testing"
)

func TestValidateURI(t *testing.T) {
	testCases := map[string]struct {
		uri    string
		result bool
	}{
		"valid hosted URI": {
			uri:    "https://www.think-it.io/",
			result: true,
		},
		"valid localhost URI": {
			uri:    "http://localhost:9090",
			result: true,
		},
		"invalid URI": {
			uri:    "think-it.io",
			result: false,
		},
	}
	for testName, testValues := range testCases {
		t.Run(testName, func(t *testing.T) {
			if err := IsURIValid(testValues.uri); err != testValues.result {
				t.Errorf("ValidateURI(%v) = %v, want %v", testValues.uri, err, testValues.result)
			}
		})
	}
}

// TODO: Add benchmark tests
