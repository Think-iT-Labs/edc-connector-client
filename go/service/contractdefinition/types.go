package contractdefinition

import (
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal/sdktypes"
)

var sdkErrors = internal.NewErrorFactory("contract-definitions")

type ContractDefinition struct {
	Context          sdktypes.Context `json:"@context"`
	Id               string           `json:"@id,omitempty"`
	Type             sdktypes.Type    `json:"@type,omitempty"`
	AccessPolicyId   string           `json:"accessPolicyId"`
	ContractPolicyId string           `json:"contractPolicyId"`
	Criteria         []Criterion      `json:"criteria"`
}

type Criterion struct {
	Context      sdktypes.Context `json:"@context,omitempty"`
	Type         sdktypes.Type    `json:"@type,omitempty"`
	OperandLeft  string           `json:"operandLeft"`
	OperandRight string           `json:"operandRight,omitempty"`
	Operator     string           `json:"operator"`
}

type GetCriterionOutput struct {
	Type         sdktypes.Type `json:"@type,omitempty"`
	OperandLeft  string        `json:"edc:operandLeft"`
	OperandRight string        `json:"edc:operandRight,omitempty"`
	Operator     string        `json:"edc:operator"`
}

type GetContractDefinitionOutput struct {
	Context          sdktypes.Context     `json:"@context"`
	Id               string               `json:"@id,omitempty"`
	Type             sdktypes.Type        `json:"@type,omitempty"`
	AccessPolicyId   string               `json:"edc:accessPolicyId"`
	ContractPolicyId string               `json:"edc:contractPolicyId"`
	Criteria         []GetCriterionOutput `json:"edc:criteria"`
}

type CreateContractDefinitionOutput struct {
	CreatedAt int64  `json:"createdAt"`
	Id        string `json:"id"`
}
