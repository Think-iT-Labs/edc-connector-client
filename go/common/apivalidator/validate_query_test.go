package apivalidator

import (
	"fmt"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
	"github.com/stretchr/testify/assert"
)

func TestValidateQueryInput(t *testing.T) {
	testCases := map[string]struct {
		sortOrder   SortOrder
		expectedErr error
		expectedMsg string
	}{
		"valid sort order": {
			sortOrder:   SortOrderAscendant,
			expectedErr: nil,
		},
		"invalid sort order": {
			sortOrder:   SortOrder("INVALID"),
			expectedErr: sdkErrors.FailedTo(internal.ACTION_INPUT_VALIDATE),
		},
	}

	for testName, testCase := range testCases {
		t.Run(testName, func(t *testing.T) {
			err := ValidateQueryInput(&testCase.sortOrder)
			assert.Equal(t, testCase.expectedErr, err)

			if err != nil {
				assert.EqualError(t, err, fmt.Sprintf("%v", testCase.expectedErr))
			}
		})
	}
}
