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

	contractId := "contract-id"
	contractDefinitionOutput, err := client.CreateContractDefinition(
		contractdefinition.ContractDefinition{
			Id:               contractId,
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

	contractDefinition, err := client.GetContractDefinition(contractId)

	if err != nil {
		fmt.Printf("error while getting a contract by id %s : %+v\n", contractId, err)
		return
	}
	fmt.Printf("%+v\n", *contractDefinition)

	allContractDefinitions, err := client.ListContractDefinitions()
	if err != nil {
		fmt.Printf("error while listing contract definitions: %v", err)
		return
	}
	fmt.Printf("%+v\n", allContractDefinitions)

	contractDefinition.Validity = 201
	err = client.UpdateContractDefinition(*contractDefinition)
	if err != nil {
		fmt.Printf("error while updating contract definitions: %v", err)
		return
	}
	updatedDefinition, _ := client.GetContractDefinition(contractId)
	fmt.Printf("Updated contract def: %+v \n", *updatedDefinition)

	err = client.DeleteContractDefinition(contractDefinition.Id)
	if err != nil {
		fmt.Printf("error while deleting policy by id %v: %v\n", contractDefinition.Id, err)
		return
	}

	allContractDefinitions, err = client.ListContractDefinitions()
	if err != nil {
		fmt.Printf("error while listing contract definitions: %v", err)
		return
	}
	fmt.Printf("all contract definitions after delete: %+v\n", allContractDefinitions)

}
