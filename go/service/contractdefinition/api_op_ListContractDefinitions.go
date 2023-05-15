package contractdefinition

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal/apivalidator"
)

func (c *Client) ListContractDefinitions(args ...apivalidator.QueryInput) ([]GetContractDefinitionOutput, error)  {
	var queryInput apivalidator.QueryInput

	if len(args) > 0 {
		queryInput = args[0]
		err := apivalidator.ValidateQueryInput(args[0].SortOrder)
		if err != nil {
			return nil, err
		}
	} else {
		queryInput = apivalidator.QueryInput{}
	}

	endpoint := fmt.Sprintf("%s/contractdefinitions/request", *c.Addresses.Management)
	contractDefinitions := []GetContractDefinitionOutput{}

	listContractDefinitionsQueryJson, err := json.Marshal(queryInput)

	if err != nil {
		return nil, fmt.Errorf("unexpected error while marshaling list contract defintions query: %v", err)
	}


	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(listContractDefinitionsQueryJson))
	if err != nil {
		return nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error while reading response body: %v", err)
	}

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: got %d from %s %s endpoint . Full response : \n %s", res.StatusCode, res.Request.Method, endpoint, response)
	}

	err = json.Unmarshal(response, &contractDefinitions)
	if err != nil {
		return nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return contractDefinitions, err
}
