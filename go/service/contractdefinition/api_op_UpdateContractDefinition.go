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
		return errors.FromError(internal.ParseConnectorApiError(response)).Error(internal.ERROR_API_ERROR)
	}

	return nil
}
