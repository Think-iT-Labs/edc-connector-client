package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reflect"
)

type DataAddress struct {
	HttpDataAddress         *HttpData
	S3StorageDataAddress    *S3Data
	AzureStorageDataAddress *AzureData
	CustomDataAddress       map[string]interface{}
}

type Asset struct {
	AssetProperties map[string]string
}

type CreateAssetInput struct {
	Asset
	DataAddress
}

type CreateAssetOutput struct {
	CreatedAt int64
	Id        string
}

func (c *Client) CreateAsset(createAssetInput CreateAssetInput) (*CreateAssetOutput, error) {
	endpoint := fmt.Sprintf("%v/assets", *c.Addresses.Management)
	createAssetOutput := CreateAssetOutput{}

	err := validateDataAddressInput(createAssetInput.DataAddress)
	if err != nil {
		return nil, err
	}

	dataAddressApiInput, err := createDataAddressFromInput(createAssetInput.DataAddress)
	if err != nil {
		return nil, err
	}

	createAssetApiInput := CreateAssetApiInput{
		AssetApiInput:       createDataAssetFromInput(createAssetInput.Asset),
		DataAddressApiInput: *dataAddressApiInput,
	}

	createAssetApiInputJson, err := json.Marshal(createAssetApiInput)

	if err != nil {
		return nil, fmt.Errorf("unexpected error while marshaling create asset input: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(createAssetApiInputJson))
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	err = json.Unmarshal(response, &createAssetOutput)
	if err != nil {
		return nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return &createAssetOutput, err
}

func createDataAddressFromInput(dataAddress DataAddress) (*DataAddressApiInput, error) {
	httpData := "HttpData"
	azureStorage := "AzureStorage"
	amazonS3 := "AmazonS3"
	if dataAddress.HttpDataAddress != nil {
		// create http address
		return &DataAddressApiInput{
			DataProperties: HttpData{
				Type:             &httpData,
				Name:             dataAddress.HttpDataAddress.Name,
				Path:             dataAddress.HttpDataAddress.Path,
				Method:           dataAddress.HttpDataAddress.Method,
				BaseUrl:          dataAddress.HttpDataAddress.BaseUrl,
				AuthKey:          dataAddress.HttpDataAddress.AuthKey,
				AuthCode:         dataAddress.HttpDataAddress.AuthCode,
				SecretName:       dataAddress.HttpDataAddress.SecretName,
				ProxyPath:        dataAddress.HttpDataAddress.ProxyPath,
				ProxyBody:        dataAddress.HttpDataAddress.ProxyBody,
				ProxyQueryParams: dataAddress.HttpDataAddress.ProxyQueryParams,
				ProxyMethod:      dataAddress.HttpDataAddress.ProxyMethod,
				ContentType:      dataAddress.HttpDataAddress.ContentType,
			},
		}, nil
	}
	if dataAddress.AzureStorageDataAddress != nil {
		return &DataAddressApiInput{
			DataProperties: AzureData{
				Type:      &azureStorage,
				Container: dataAddress.AzureStorageDataAddress.Container,
				Account:   dataAddress.AzureStorageDataAddress.Account,
				BlobName:  dataAddress.AzureStorageDataAddress.BlobName,
			},
		}, nil
	}
	if dataAddress.S3StorageDataAddress != nil {
		return &DataAddressApiInput{
			DataProperties: S3Data{
				Type:            &amazonS3,
				Name:            dataAddress.S3StorageDataAddress.Name,
				BucketName:      dataAddress.S3StorageDataAddress.BucketName,
				AccessKeyId:     dataAddress.S3StorageDataAddress.AccessKeyId,
				SecretAccessKey: dataAddress.S3StorageDataAddress.SecretAccessKey,
			},
		}, nil
	}
	if dataAddress.CustomDataAddress != nil {
		return &DataAddressApiInput{
			DataProperties: CustomData(dataAddress.CustomDataAddress),
		}, nil
	}
	return nil, fmt.Errorf("unsupported type of asset address")
}

func createDataAssetFromInput(asset Asset) AssetApiInput {
	return AssetApiInput(asset)
}

func validateDataAddressInput(dataAddress DataAddress) error {
	nonNilFieldsCount := 0
	v := reflect.ValueOf(dataAddress)
	for i := 0; i < v.NumField(); i++ {
		if !v.Field(i).IsNil() {
			nonNilFieldsCount++
		}
	}
	if nonNilFieldsCount > 1 {
		return fmt.Errorf("data address field is invalid, cannot have more than 1 address property")
	}
	return nil
}
