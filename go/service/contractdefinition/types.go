package contractdefinition

type ContractDefinition struct {
	Id               string      `json:"id"`
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
	CreateContractDefinitionOutput
}

type CreateContractDefinitionOutput struct {
	CreatedAt int64  `json:"createdAt"`
	Id        string `json:"id"`
}
