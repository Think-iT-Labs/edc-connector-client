package assets

import (
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/sharedtypes"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

type CreateAssetRequestPayload struct {
	sharedtypes.RequestBase
	AssetProperties `json:"asset"`
	DataAddress     CreateDataAddressPayload `json:"dataAddress"`
}

type CreateDataAddressPayload struct {
	DataAddress
	Type DataAddressType
}

func (c *Client) CreateAsset(asset AssetProperties, dataAddress DataAddress) (*sharedtypes.ResponseBase, error) {

	requestpayload := CreateAssetRequestPayload{
		RequestBase: sharedtypes.RequestBase{
			Context: sharedtypes.EdcContext,
		},
		AssetProperties: asset,
		DataAddress: CreateDataAddressPayload{
			Type:        getDataAddressType(dataAddress),
			DataAddress: dataAddress,
		},
	}
	endpoint := fmt.Sprintf("%s/assets", *c.Addresses.Management)
	createAssetResponse := sharedtypes.ResponseBase{}
	err := c.HTTPClient.InvokeOperation(internal.InvokeHTTPOperationOptions{
		Method:             http.MethodPost,
		Endpoint:           endpoint,
		RequestPayload:     requestpayload,
		ResponsePayload:    createAssetResponse,
		ExpectedStatusCode: http.StatusOK,
	})

	if err != nil {
		return nil, err
	}

	return &createAssetResponse, nil
}

func getDataAddressType(dataAddress DataAddress) DataAddressType {
	if _, ok := dataAddress.(HttpData); ok {
		return DataAddressTypeHttp
	}
	if _, ok := dataAddress.(S3Data); ok {
		return DataAddressTypeS3
	}
	if _, ok := dataAddress.(AzureData); ok {
		return DataAddressTypeAzure
	}
	return DataAddressTypeCustom
}

func (dap CreateDataAddressPayload) MarshalJSON() ([]byte, error) {
	result := make(map[string]interface{}, 0)
	result["edc:type"] = dap.Type

	da := reflect.TypeOf(dap.DataAddress)
	for i := 0; i < da.NumField(); i++ {
		field := da.Field(i)
		// get tag without instructions such as 'omitempty'
		jsonTag := strings.Split(field.Tag.Get("json"), ",")[0]
		result[jsonTag] = reflect.ValueOf(dap.DataAddress).Field(i).String()
	}
	return json.Marshal(result)
}
