package contractdefinition

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) UpdateContractDefinition(cd ContractDefinition) error {
	endpoint := fmt.Sprintf("%s/contractdefinitions/%s", *c.Management, cd.Id)
	contractDefintionApiInput, err := json.Marshal(cd)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_JSON_MARSHAL)
	}

	req, err := http.NewRequest(http.MethodPut, endpoint, bytes.NewBuffer(contractDefintionApiInput))
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_BUILD_REQUEST)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_DO_REQUEST)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return errors.FromError(err).FailedTo(internal.ACTION_HTTP_READ_BYTES)
	}

	if res.StatusCode != http.StatusNoContent {
		// The contract definitions API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
		}
		// TODO: can return more than 1 eleement in error array???
		return errors.FromError(v[0]).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	return nil
}
