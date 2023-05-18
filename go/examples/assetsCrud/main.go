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
		assets.CreateAssetInput{
			Asset: assets.Asset{
				AssetProperties: map[string]string{
					"asset:prop:id":          assetId,
					"asset:prop:name":        assetName,
					"asset:prop:contenttype": "application/json",
				},
			},
			DataAddress: assets.DataAddress{
				HttpDataAddress: &assets.HttpData{
					Name:    &httpName,
					BaseUrl: &httpBaseUrl,
				},
			},
		},
	)
	if err != nil {
		fmt.Printf("error while creating an asset: %v\n", err)
		return
	}
	fmt.Println(*createAssetsOutput)

	allAssets, err := client.ListAssets()
	if err != nil {
		fmt.Println("error while listing assets")
		return
	}
	fmt.Println(allAssets)

	asset, err := client.GetAsset(createAssetsOutput.Id)
	if err != nil {
		fmt.Printf("error while getting an asset by id %v\n", createAssetsOutput.Id)
		return
	}
	fmt.Println(*asset)

	updatedAssetProperties := &assets.AssetApiInput{
		AssetProperties: map[string]string{"asset:prop:name": "updated name"},
	}

	err = client.UpdateAssetProperties(*updatedAssetProperties, assetId)
	if err != nil {
		fmt.Printf("error while updating an asset by id %v\n %v", err, assetId)
		return
	}

	asset, err = client.GetAsset(assetId)
	if err != nil {
		fmt.Printf("error while getting an asset by id %v\n", assetId)
		return
	}

	if asset.AssetProperties["asset:prop:name"] != "updated name" {
		fmt.Printf("asset update failed %v\n", asset)
		return
	}

	// Create custom asset data address
	customData := map[string]interface{}{
		"name":    "Custom Test asset",
		"baseUrl": "https://jsonplaceholder.typicode.com/users",
		"type":    "HttpData",
	}
	secondAssetId := "customAsset"
	secondAssetName := "customAssetName"
	createAssetsOutput, err = client.CreateAsset(assets.CreateAssetInput{
		Asset: assets.Asset{
			AssetProperties: map[string]string{
				"asset:prop:id":          secondAssetId,
				"asset:prop:name":        secondAssetName,
				"asset:prop:contenttype": "application/json",
			},
		},
		DataAddress: assets.DataAddress{
			CustomDataAddress: customData,
		},
	})

	if err != nil {
		fmt.Printf("error while trying to create asset with custom data address: %v", err)
		return
	}
	fmt.Println(createAssetsOutput)

	asset, err = client.GetAsset(secondAssetId)
	if err != nil {
		fmt.Printf("error while getting an asset by id %v\n", secondAssetId)
		return
	}
	if asset.Id != secondAssetId {
		fmt.Printf("Asset ID is not correct, expected %v", secondAssetId)
	}

	assetDA, err := client.GetAssetDataAddress(secondAssetId)

	if err != nil {
		fmt.Printf("error while getting an asset data address by id %v\n", secondAssetId)
		return
	}

	if assetDA.AssetProperties["type"] != "HttpData" {
		fmt.Printf("error unexpected data address for id %s got %s", secondAssetId, assetDA.AssetProperties["type"])
	}

	err = client.DeleteAsset(asset.Id)
	if err != nil {
		fmt.Printf("error while deleting asset by id %v\n", asset.Id)
		return
	}

		allAssets, err = client.ListAssets()
	if err != nil {
		fmt.Println("error while listing assets")
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
	
	// filterExpression := *filter.FilterExpression
	// filter.FilterExpression = &filterExpression
	
	_, err = client.ListAssets(filter)
	
	if err != nil {
		fmt.Printf("error while listing assets %v", filter )
		return
	}
	// fmt.Println(filteredAssets)
}
