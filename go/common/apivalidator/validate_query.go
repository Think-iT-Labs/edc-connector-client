package apivalidator

import (
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func ValidateQueryInput(sortOrder *SortOrder) error {
	if sortOrder == nil {
		return nil
	}
	if *sortOrder != SortOrderAscendant && *sortOrder != SortOrderDescendant {
		return sdkErrors.FailedTo(internal.ACTION_INPUT_VALIDATE)
	}
	return nil
}
