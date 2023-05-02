package apivalidator 

import (
	"fmt"
)

func ValidateQueryInput(sortOrder *SortOrder) error {
	if sortOrder == nil {
		return nil
	}
	if *sortOrder != SortOrderAscendant && *sortOrder != SortOrderDescendant {
		return fmt.Errorf("invalid value of sortOrder, possible values are: %v",
			[]SortOrder{SortOrderAscendant, SortOrderDescendant})
	}
	return nil
}
