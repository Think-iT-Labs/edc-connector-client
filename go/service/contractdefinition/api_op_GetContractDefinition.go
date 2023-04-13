package contractdefinition

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func (c *Client) GetContractDefinition(ContractDefinitionId string) (*ContractDefinition, error) {
	endpoint := fmt.Sprintf("%v/contractdefinitions/%v", *c.Addresses.Management, ContractDefinitionId)
	contractDefinition := ContractDefinition{}

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing GET request to the endpoint %v: %v", endpoint, err)
	}
	defer res.Body.Close()

	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		return nil, fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	err = json.Unmarshal(response, &contractDefinition)
	if err != nil {
		return nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return &contractDefinition, err
}
