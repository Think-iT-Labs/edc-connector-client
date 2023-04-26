package assets

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func Test_CreateAsset(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"asset": {
		"properties": {
			"asset:prop:id": "1234",
			"asset:prop:name": "product description",
			"asset:prop:contenttype": "application/json"
		}
	},
	"dataAddress": {
		"properties": {
			"name": "Test asset",
			"baseUrl": "https://jsonplaceholder.typicode.com/users",
			"type": "HttpData"
		}
	}
}`, string(payload), "invalid payload")

		fmt.Fprintf(w, `
{
	"createdAt": 1680004526,
	"id": "1234"
}		
`)
	}))
	defer svr.Close()

	cfg := edc.NewConfig()

	cfg.Addresses = edc.Addresses{
		Management: &svr.URL,
	}
	httpClient, err := edchttp.NewHTTPClient(&authToken)
	assert.NoError(t, err, "failed to initialize Http Client")
	cfg.HTTPClient = httpClient

	apiClient, err := New(*cfg)
	assert.NoError(t, err, "failed to initialize api client")

	assetName := "Test asset"
	assetBaseUrl := "https://jsonplaceholder.typicode.com/users"
	assetId := "1234"
	httpData := "HttpData"
	createAssetOutput, err := apiClient.CreateAsset(
		CreateAssetInput{
			Asset{
				AssetProperties: map[string]string{
					"asset:prop:id":          assetId,
					"asset:prop:name":        "product description",
					"asset:prop:contenttype": "application/json",
				},
			},
			DataAddress{
				HttpDataAddress: &HttpData{
					Type:    &httpData,
					Name:    &assetName,
					BaseUrl: &assetBaseUrl,
				},
			},
		},
	)
	assert.NoError(t, err, "failed to create asset.")
	assert.Equal(t, createAssetOutput.Id, assetId)
}

func Test_validateDataAddressInput(t *testing.T) {
	httpName := "http"
	type args struct {
		dataAddress DataAddress
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "valid input",
			args: args{
				dataAddress: DataAddress{
					HttpDataAddress: &HttpData{Name: &httpName},
				},
			},
			wantErr: false,
		},
		{
			name: "invalid input",
			args: args{
				dataAddress: DataAddress{
					HttpDataAddress:      &HttpData{Name: &httpName},
					S3StorageDataAddress: &S3Data{Name: &httpName},
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := validateDataAddressInput(tt.args.dataAddress); (err != nil) != tt.wantErr {
				t.Errorf("validateDataAddressInput() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_createDataAddressFromInput(t *testing.T) {
	httpName := "http"
	httpPath := "path"
	httpMethod := "method"
	httpBaseUrl := "baseUrl"
	httpAuthKey := "authKey"
	httpAuthCode := "authCode"
	httpSecretName := "secretName"
	httpProxyBody := "proxyBody"
	httpProxyPath := "proxyPath"
	httpProxyQueryParams := "proxyQueryParams"
	httpProxyMethod := "secretName"
	httpContentType := "contentType"

	s3Name := "name"
	s3BucketName := "bucketName"
	s3AccessKeyId := "accessKeyId"
	s3SecretAccessKey := "secretAccessKey"

	azureContainer := "container"
	azureBlobName := "blobname"
	azureAccount := "accountName"

	httpData := "HttpData"
	amazonS3 := "AmazonS3"
	azureStorage := "AzureStorage"

	type args struct {
		dataAddress DataAddress
	}
	tests := []struct {
		name    string
		args    args
		want    *DataAddressApiInput
		wantErr bool
	}{
		{
			name:    "Http data address property should be passed correctly",
			wantErr: false,
			want: &DataAddressApiInput{
				DataProperties: HttpData{
					Type:             &httpData,
					Name:             &httpName,
					Path:             &httpPath,
					Method:           &httpMethod,
					BaseUrl:          &httpBaseUrl,
					AuthKey:          &httpAuthKey,
					AuthCode:         &httpAuthCode,
					SecretName:       &httpSecretName,
					ProxyBody:        &httpProxyBody,
					ProxyPath:        &httpProxyPath,
					ProxyQueryParams: &httpProxyQueryParams,
					ProxyMethod:      &httpProxyMethod,
					ContentType:      &httpContentType,
				},
			},
			args: args{
				dataAddress: DataAddress{
					HttpDataAddress: &HttpData{
						Type:             &httpData,
						Name:             &httpName,
						Path:             &httpPath,
						Method:           &httpMethod,
						BaseUrl:          &httpBaseUrl,
						AuthKey:          &httpAuthKey,
						AuthCode:         &httpAuthCode,
						SecretName:       &httpSecretName,
						ProxyBody:        &httpProxyBody,
						ProxyPath:        &httpProxyPath,
						ProxyQueryParams: &httpProxyQueryParams,
						ProxyMethod:      &httpProxyMethod,
						ContentType:      &httpContentType,
					},
				},
			},
		},
		{
			name:    "S3 data address property should be passed correctly",
			wantErr: false,
			want: &DataAddressApiInput{
				DataProperties: S3Data{
					Type:            &amazonS3,
					Name:            &s3Name,
					BucketName:      &s3BucketName,
					AccessKeyId:     &s3AccessKeyId,
					SecretAccessKey: &s3SecretAccessKey,
				},
			},
			args: args{
				dataAddress: DataAddress{
					S3StorageDataAddress: &S3Data{
						Type:            &amazonS3,
						Name:            &s3Name,
						BucketName:      &s3BucketName,
						AccessKeyId:     &s3AccessKeyId,
						SecretAccessKey: &s3SecretAccessKey,
					},
				},
			},
		},
		{
			name:    "Azure data address property should be passed correctly",
			wantErr: false,
			want: &DataAddressApiInput{
				DataProperties: AzureData{
					Type:      &azureStorage,
					Account:   &azureAccount,
					BlobName:  &azureBlobName,
					Container: &azureContainer,
				},
			},
			args: args{
				dataAddress: DataAddress{
					AzureStorageDataAddress: &AzureData{
						Type:      &azureStorage,
						Account:   &azureAccount,
						BlobName:  &azureBlobName,
						Container: &azureContainer,
					},
				},
			},
		},
		{
			name: "Unkown data address property is passed",
			args: args{
				dataAddress: DataAddress{},
			},
			want:    nil,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := createDataAddressFromInput(tt.args.dataAddress)
			if (err != nil) != tt.wantErr {
				t.Errorf("createDataAddressFromInput() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("createDataAddressFromInput() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_CreateAssetWithCustomDataAddress(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"asset": {
		"properties": {
			"asset:prop:id": "1234",
			"asset:prop:name": "product description",
			"asset:prop:contenttype": "application/json"
		}
	},
	"dataAddress": {
		"properties": {
			"name": "This is custom Address",
			"customKey": "This is custom key"
		}
	}
}`, string(payload), "invalid payload")

		fmt.Fprintf(w, `
{
	"createdAt": 1680004526,
	"id": "1234"
}`)
	}))
	defer svr.Close()

	cfg := edc.NewConfig()

	cfg.Addresses = edc.Addresses{
		Management: &svr.URL,
	}
	httpClient, err := edchttp.NewHTTPClient(&authToken)
	assert.NoError(t, err, "failed to initialize Http Client")
	cfg.HTTPClient = httpClient

	apiClient, err := New(*cfg)
	assert.NoError(t, err, "failed to initialize api client")

	customDataAddress := map[string]interface{}{
		"name":      "This is custom Address",
		"customKey": "This is custom key",
	}
	assetId := "1234"
	createAssetOutput, err := apiClient.CreateAsset(
		CreateAssetInput{
			Asset{
				AssetProperties: map[string]string{
					"asset:prop:id":          assetId,
					"asset:prop:name":        "product description",
					"asset:prop:contenttype": "application/json",
				},
			},
			DataAddress{
				CustomDataAddress: customDataAddress,
			},
		},
	)
	assert.NoError(t, err, "failed to create asset.")
	assert.Equal(t, createAssetOutput.Id, assetId)
}
