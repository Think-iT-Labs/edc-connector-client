package main

import (
	"fmt"

	"github.com/Think-iT-Labs/edc-connector-client/go/config"
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	"github.com/Think-iT-Labs/edc-connector-client/go/service/contractdefinition"
)

func main() {
	token := "example token"
	defaultAddress := "http://localhost:19193/api"
	managementAddress := "http://localhost:19193/api/v1/data"
	protocolAddress := "http://localhost:19193/api/v1/ids"
	publicAddress := "http://localhost:19193/public"
	controlAddress := "http://localhost:19193/control"

	edcAddresses := edc.Addresses{
		Default:    &defaultAddress,
		Management: &managementAddress,
		Protocol:   &protocolAddress,
		Public:     &publicAddress,
		Control:    &controlAddress,
	}

	cfg, err := config.LoadConfig(
		token,
		edcAddresses,
	)

	if err != nil {
		fmt.Println("error while loading edc config")
		return
	}

	client, err := contractdefinition.New(*cfg)
	if err != nil {
		fmt.Println("error while loading edc config")
		return
	}

	contractDefinitionOutput, err := client.CreateContractDefinition(
		contractdefinition.ContractDefinition{
			Id:               "contract-id",
			AccessPolicyId:   "example-access-policy-id",
			ContractPolicyId: "example-contract-policy-id",
			Criteria:         make([]contractdefinition.Criterion, 0),
		},
	)

	if err != nil {
		fmt.Printf("error while creating an asset: %v\n", err)
		return
	}
	fmt.Printf("%+v\n", *contractDefinitionOutput)

}
