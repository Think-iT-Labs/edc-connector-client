package apivalidator

import "github.com/Think-iT-Labs/edc-connector-client/go/internal"

type SortOrder string

var sdkErrors = internal.NewErrorFactory("query")

const (
	SortOrderAscendant  SortOrder = "ASC"
	SortOrderDescendant SortOrder = "DESC"
)

type Criterion struct {
	OperandLeft  string `json:"operandLeft,omitempty"`
	OperandRight *string `json:"operandRight,omitempty"`
	Operator     string `json:"operator,omitempty"`
}

type QueryInput struct {
	Filter           *string      `json:"filter,omitempty"`
	FilterExpression *[]Criterion `json:"filterExpression,omitempty"`
	Limit            *int64       `json:"limit,omitempty"`
	Offset           *int64       `json:"offset,omitempty"`
	SortField        *string      `json:"sortField,omitempty"`
	SortOrder        *SortOrder   `json:"sortOrder,omitempty"`
}
