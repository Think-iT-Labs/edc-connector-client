package contractdefinition

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) CreateContractDefinition(cd ContractDefinition) (*CreateContractDefinitionOutput, error) {
	endpoint := fmt.Sprintf("%s/contractdefinitions", *c.Management)
	contractDefinitionApiInput, err := json.Marshal(cd)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewBuffer(contractDefinitionApiInput))
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusOK {
		// The contract definitions API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
		}
		// TODO: can return more than 1 eleement in error array???
		return nil, errors.FromError(v[0]).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	ContractDefinitionOutput := CreateContractDefinitionOutput{}
	err = json.Unmarshal(response, &ContractDefinitionOutput)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
	}

	return &ContractDefinitionOutput, nil
}
