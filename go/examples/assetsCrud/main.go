package main

import (
	"assets"
	"fmt"

	"github.com/Think-iT-Labs/edc-connector-client/go/config"
	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
)

func main() {

	token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
	defaultAddress := "http://localhost:29193/api"
	managementAddress := "http://localhost:29193/api/v1/data"
	protcolAddress := "http://localhost:29193/api/v1/ids"
	publicAddress := "http://localhost:29193/public"
	controlAddress := "http://localhost:29193/control"

	edcAddresses := edc.Addresses{
		Default:    &defaultAddress,
		Management: &managementAddress,
		Protocol:   &protcolAddress,
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
				AssetProperties: assets.AssetProperties{
					"asset:prop:id":          assetId,
					"asset:prop:name":        assetName,
					"asset:prop:contenttype": "application/json",
				},
			},
			DataAddress: assets.DataAddress{
				HttpDataAddress: &assets.HttpDataAddress{
					BaseAddress: &assets.BaseAddress{
						Type: "HttpData",
					},
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
}
