package policies

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal"
)

func (c *Client) DeletePolicy(policyId string) error {
	endpoint := fmt.Sprintf("%s/policydefinitions/%s", *c.Addresses.Management, policyId)

	req, err := http.NewRequest("DELETE", endpoint, nil)
	if err != nil {
		return errors.Wrap(err).FailedTo("build delete policy request")
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return errors.Wrap(err).FailedTo("perform HTTP request")
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return errors.Wrap(err).FailedTo("read response")
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 || res.StatusCode < 300
	if !statusOk {
		// The policies API returns error in an array.
		var v []internal.ConnectorApiError
		err = json.Unmarshal(response, &v)
		if err != nil {
			return errors.Wrap(err).FailedTo("unmarshal json")
		}
		return errors.Errorf("error from connector: %+v", v)
	}

	return nil
}
