package contractdefinition

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func (c *Client) UpdateContractDefinition(cd ContractDefinition) error {
	endpoint := fmt.Sprintf("%s/contractdefinitions/%s", *c.Management, cd.Id)
	contractDefintionApiInput, err := json.Marshal(cd)
	if err != nil {
		return fmt.Errorf("unexpected error while marshaling update contract definition input: %v", err)
	}

	req, err := http.NewRequest(http.MethodPut, endpoint, bytes.NewBuffer(contractDefintionApiInput))
	if err != nil {
		return fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("error while performing PUT request to the endpoint %s: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	return nil
}
