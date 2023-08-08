package main

import (
	"fmt"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/apivalidator"
	"github.com/Think-iT-Labs/edc-connector-client/go/config"
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	"github.com/Think-iT-Labs/edc-connector-client/go/service/assets"
)

func main() {

	token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
	defaultAddress := "http://localhost:19193/api"
	managementAddress := "http://localhost:19193/management/v2"
	protocolAddress := "http://localhost:19193/protocol"
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

	client, err := assets.New(*cfg)

	if err != nil {
		fmt.Println("error while loading assets client")
		return
	}

	assetId := "1234"
	assetName := "product description"

	httpName := "name"
	httpBaseUrl := "http://think-it.edc.io/"

	createAssetsOutput, err := client.CreateAsset(
		assets.AssetProperties{
			Id: assetId,
			PublicProperties: map[string]string{
				"name":        assetName,
				"contenttype": "application/json",
				"version":     "0.0.1",
			},
			PrivateProperties: map[string]string{
				"secret": "very-private-thing",
			},
		},
		assets.HttpData{
			BaseUrl:       httpBaseUrl,
			HttpAssetName: httpName,
		},
	)
	if err != nil {
		fmt.Printf("error while creating an asset: %v\n", err)
		return
	}
	fmt.Printf("create asset output: %+v\n", *createAssetsOutput)

	allAssets, err := client.ListAssets()
	if err != nil {
		fmt.Printf("error while listing assets: %+v\n", err)
		return
	}
	fmt.Printf("all assets: %+v\n", allAssets)

	asset, err := client.GetAssetProperties(createAssetsOutput.Id)
	if err != nil {
		fmt.Printf("error while getting an asset by id %v. error: %v\n", createAssetsOutput.Id, err)
		return
	}
	fmt.Printf("asset of id %s: %+v\n ", assetId, *asset)

	updatedAssetProperties := assets.AssetProperties{
		PublicProperties:  map[string]string{"name": "updated name"},
		PrivateProperties: map[string]string{"secret": "updated private prop"},
	}

	err = client.UpdateAssetProperties(assetId, updatedAssetProperties)
	if err != nil {
		fmt.Printf("error while updating an asset by id %s: %v \n", assetId, err)
		return
	}

	assetProperties, err := client.GetAssetProperties(assetId)
	if err != nil {
		fmt.Printf("error while getting an asset by id %s, err: %v\n", assetId, err)
		return
	}

	if assetProperties.PublicProperties["name"] != "updated name" || assetProperties.PrivateProperties["secret"] != "updated private prop" {
		fmt.Printf("asset update failed %v\n", asset)
		return
	}

	//Create custom asset data address
	customData := assets.CustomData{
		"name":    "Custom Test asset",
		"baseUrl": "https://jsonplaceholder.typicode.com/users",
		"type":    "HttpData",
	}
	secondAssetId := "customAsset"
	secondAssetName := "customAssetName"
	createAssetsOutput, err = client.CreateAsset(
		assets.AssetProperties{
			Id: secondAssetId,
			PublicProperties: map[string]string{
				"edc:name":        secondAssetName,
				"edc:contenttype": "application/json",
			},
			PrivateProperties: map[string]string{
				"secret": "top secret 2",
			},
		},
		customData,
	)
	if err != nil {
		fmt.Printf("error while trying to create asset with custom data address: %v\n", err)
		return
	}
	fmt.Println(createAssetsOutput)

	asset, err = client.GetAssetProperties(secondAssetId)
	if err != nil {
		fmt.Printf("error while getting an asset by id %v\n", secondAssetId)
		return
	}
	if asset.Id != secondAssetId {
		fmt.Printf("Asset ID is not correct, expected %v", secondAssetId)
		return
	}

	assetDA, err := client.GetAssetDataAddress(secondAssetId)

	if err != nil {
		fmt.Printf("error while getting an asset data address by id %v\n", secondAssetId)
		return
	}

	if assetDA.(assets.HttpData).Type != "HttpData" {
		fmt.Printf("error unexpected data address for id \"%s\". expected:\n %v \n got: \n %v\n", secondAssetId, "HttpData", assetDA)
		return
	}

	err = client.DeleteAsset(asset.Id)
	if err != nil {
		fmt.Printf("error while deleting asset by id %v: \n%v\n", asset.Id, err)
		return
	}

	allAssets, err = client.ListAssets()
	if err != nil {
		fmt.Printf("error while listing assets: \n%v\n", err)
		return
	}
	fmt.Println(allAssets)

	// Add a filtering query
	filter := apivalidator.QueryInput{
		FilterExpression: &[]apivalidator.Criterion{
			{
				OperandLeft:  "asset:prop:id",
				OperandRight: &assetId,
				Operator:     "=",
			},
		},
	}

	filteredAssets, err := client.ListAssets(filter)

	if err != nil {
		fmt.Printf("error while listing assets with filter %v: \n%v\n", filter, err)
		return
	}
	fmt.Println(filteredAssets)
}
