package policies

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/Think-iT-Labs/edc-connector-client/go/internal/apivalidator"
)

func (c *Client) ListPolicies(args ...apivalidator.QueryInput) ([]PolicyDefinition, []ApiErrorDetail, error)  {
	var queryInput apivalidator.QueryInput

	if len(args) > 0 {
		queryInput = args[0]
		err := apivalidator.ValidateQueryInput(args[0].SortOrder)
		if err != nil {
			return nil, nil, err
		}
	} else {
		queryInput = apivalidator.QueryInput{}
	}

	endpoint := fmt.Sprintf("%v/policydefinitions/request", *c.Addresses.Management)
	policies := []PolicyDefinition{}

	listPoliciesQueryJson, err := json.Marshal(queryInput)

	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while marshaling list policies query: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(listPoliciesQueryJson))
	if err != nil {
		return nil, nil, fmt.Errorf("unexpected error while building HTTP request: %v", err)
	}

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, nil, fmt.Errorf("error while performing POST request to the endpoint %v: %v", endpoint, err)
	}

	defer res.Body.Close()
	response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, nil, fmt.Errorf("error while reading response body: %v", err)
	}

	// when status code >= 400, it means there's an error from the api that we should handle
	statusOk := res.StatusCode == 200 && res.StatusCode < 300
	if !statusOk {
		var v []ApiErrorDetail
		err = json.Unmarshal(response, &v)
		if err != nil {
			return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
		}
		return nil, v, nil
	}

	err = json.Unmarshal(response, &policies)
	if err != nil {
		return nil, nil, fmt.Errorf("error while unmarshaling json: %v", err)
	}

	return policies, nil, err
}
