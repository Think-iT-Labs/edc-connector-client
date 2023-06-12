package assets

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal/sharedtypes"
)

type CreateAssetRequestPayload struct {
	sharedtypes.BaseRequest
	AssetProperties `json:"asset"`
	DataAddress     ModifyDataAddressPayload `json:"dataAddress"`
}

func (c *Client) CreateAsset(asset AssetProperties, dataAddress DataAddress) (*sharedtypes.BaseResponse, error) {

	requestpayload := CreateAssetRequestPayload{
		BaseRequest: sharedtypes.BaseRequest{
			Context: sharedtypes.EdcContext,
		},
		AssetProperties: asset,
		DataAddress: ModifyDataAddressPayload{
			Type:        getDataAddressType(dataAddress),
			DataAddress: dataAddress,
		},
	}
	endpoint := fmt.Sprintf("%s/assets", *c.Addresses.Management)
	createAssetResponse := sharedtypes.BaseResponse{}
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
