package assets

import (
	"encoding/json"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

var sdkErrors = internal.NewErrorFactory("assets")

type ModifyDataAddressPayload struct {
	DataAddress
	Type DataAddressType
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

func (dap ModifyDataAddressPayload) MarshalJSON() ([]byte, error) {
	result := make(map[string]interface{}, 0)
	var intermediate []byte
	intermediate, err := json.Marshal(dap.DataAddress)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(intermediate, &result)
	if err != nil {
		return nil, err
	}
	result["edc:type"] = dap.Type
	return json.Marshal(result)
}

func unmarshalToConcreteDataAddress(response []byte) (DataAddress, error) {
	dataAddressBase := DataAddressBase{}
	err := json.Unmarshal(response, &dataAddressBase)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
	}
	switch dataAddressBase.Type {
	case DataAddressTypeHttp:
		httpData := HttpData{}
		err = json.Unmarshal(response, &httpData)
		if err != nil {
			return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
		return httpData, nil
	case DataAddressTypeS3:
		s3Data := S3Data{}
		err = json.Unmarshal(response, &s3Data)
		if err != nil {
			return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
		return s3Data, nil
	case DataAddressTypeAzure:
		azureData := AzureData{}
		err = json.Unmarshal(response, &azureData)
		if err != nil {
			return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
		return azureData, nil
	default:
		// assuming customdata type do not have "edc:type" set
		customData := CustomData{}
		err = json.Unmarshal(response, &customData)
		if err != nil {
			return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
		}
		return customData, nil
	}
}
