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

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("build request")
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("perform http request")
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("read response body")
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		// The policies API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, errors.Wrap(err).FailedTo("while unmarshaling json")
		}
		return nil, errors.Errorf("error from connector: %+v", v)
	}

	err = json.Unmarshal(response, &policyDefinition)
	if err != nil {
		return nil, errors.Wrap(err).FailedTo("while unmarshaling json")
	}

	return &policyDefinition, nil
}
