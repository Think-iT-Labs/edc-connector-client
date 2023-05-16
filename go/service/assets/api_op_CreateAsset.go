package assets

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reflect"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
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
	endpoint := fmt.Sprintf("%s/assets", *c.Addresses.Management)
	createAssetOutput := CreateAssetOutput{}

	err := validateDataAddressInput(createAssetInput.DataAddress)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_INPUT_VALIDATE)
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
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewBuffer(createAssetApiInputJson))
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusOK {
		return nil, sdkErrors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	err = json.Unmarshal(response, &createAssetOutput)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
	}

	return &createAssetOutput, nil
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
