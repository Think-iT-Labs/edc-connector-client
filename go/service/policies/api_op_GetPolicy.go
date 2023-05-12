package policies

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) GetPolicy(policyId string) (*PolicyDefinition, error) {
	endpoint := fmt.Sprintf("%s/policydefinitions/%s", *c.Addresses.Management, policyId)
	policyDefinition := PolicyDefinition{}

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

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		return nil, errors.FromError(internal.ParseConnectorApiError(response)).FailedTo(internal.ACTION_API_SUCCESSFUL_RESULT)
	}

	err = json.Unmarshal(response, &policyDefinition)
	if err != nil {
		return nil, errors.FromError(err).FailedTo(internal.ACTION_JSON_UNMARSHAL)
	}

	return &policyDefinition, nil
}
