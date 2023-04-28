package main

import (
	"fmt"

	"github.com/Think-iT-Labs/edc-connector-client/go/config"
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	"github.com/Think-iT-Labs/edc-connector-client/go/service/policies"
)

func main() {

	token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
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

	client, err := policies.New(*cfg)

	if err != nil {
		fmt.Println("error while loading assets client")
		return
	}

	policyId := "1234"
	uuid := "f08e21cf-f4b4-49b5-aea1-bcec21336d09"

	createPolicyOutput, err := client.CreatePolicy(policies.CreatePolicyInput{
		Id: &policyId,
		Policy: policies.Policy{
			UID: &uuid,
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(createPolicyOutput.Id)

	allPolicies, apiError, err := client.ListPolicies(policies.ListPoliciesInput{})
	if err != nil {
		fmt.Printf("error while listing policies: %v", err)
		return
	}
	if apiError != nil {
		fmt.Println(*apiError[0].Message)
		return
	}
	fmt.Println(allPolicies)

	policy, apiError, err := client.GetPolicy(policyId)
	if err != nil {
		fmt.Printf("error while getting an policy by id %v\n", policyId)
		return
	}
	if apiError != nil {
		fmt.Println(*apiError[0].Message)
		return
	}
	fmt.Println(*policy)

	apiError, err = client.DeletePolicy(policy.Id)
	if err != nil {
		fmt.Printf("error while deleting policy by id %v: %v\n", policy.Id, err)
		return
	}
	if apiError != nil {
		fmt.Println(*apiError[0].Message)
		return
	}

	allPolicies, apiError, err = client.ListPolicies(policies.ListPoliciesInput{})
	if err != nil {
		fmt.Println("error while listing assets")
		return
	}
	if apiError != nil {
		fmt.Println(*apiError[0].Message)
		return
	}
	fmt.Println(allPolicies)
}
