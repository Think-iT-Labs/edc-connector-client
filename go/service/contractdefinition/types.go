package contractdefinition

import "github.com/Think-iT-Labs/edc-connector-client/go/internal"

var sdkErrors = internal.NewErrorFactory("contract-definitions")

type ContractDefinition struct {
	Id               string      `json:"id,omitempty"`
	AccessPolicyId   string      `json:"accessPolicyId"`
	ContractPolicyId string      `json:"contractPolicyId"`
	Validity         int64       `json:"validity,omitempty"`
	Criteria         []Criterion `json:"criteria"`
}

type Criterion struct {
	OperandLeft  string `json:"operandLeft"`
	OperandRight string `json:"operandRight,omitempty"`
	Operator     string `json:"operator"`
}

type GetContractDefinitionOutput struct {
	ContractDefinition
	CreatedAt int64 `json:"createdAt"`
}

type CreateContractDefinitionOutput struct {
	CreatedAt int64  `json:"createdAt"`
	Id        string `json:"id"`
}
