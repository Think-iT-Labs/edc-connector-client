package assets

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/common/sharedtypes"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

type DataAddressResponse struct {
	sharedtypes.ResponseBase
	DataAddressBase
	HttpData
	S3Data
	AzureData
	CustomData
}

func (c *Client) GetAssetDataAddress(assetId string) (*DataAddressResponse, error) {
	endpoint := fmt.Sprintf("%s/assets/%s/dataaddress", *c.Addresses.Management, assetId)

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
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

	dataAddress := DataAddressResponse{}
	err = json.Unmarshal(response, &dataAddress)
	if err != nil {
		return nil, sdkErrors.FromError(err).FailedTof(internal.ACTION_JSON_UNMARSHAL, response)
	}
	return &dataAddress, nil
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
