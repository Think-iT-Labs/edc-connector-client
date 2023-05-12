package contractdefinition

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) GetContractDefinition(ContractDefinitionId string) (*ContractDefinition, error) {
	endpoint := fmt.Sprintf("%s/contractdefinitions/%s", *c.Addresses.Management, ContractDefinitionId)
	contractDefinition := ContractDefinition{}

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
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
		return nil, errors.FromError(internal.ParseConnectorApiError(response)).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	err = json.Unmarshal(response, &contractDefinition)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
	}

	return &contractDefinition, nil
}
