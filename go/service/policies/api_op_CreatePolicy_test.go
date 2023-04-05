package policies

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func Test_CreateAsset(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		payload, err := ioutil.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"id": "1234",
	"policy": {
		"uid": "a2123-b144123-c1242",
		"assignee": "edc-user-1",
		"assigner": "edc-user-2"
	}
}`, string(payload), "invalid payload")

		fmt.Fprintf(w, `
{
	"createdAt": 1680004526,
	"id": "1234"
}
`)
	}))
	defer svr.Close()

	cfg := edc.NewConfig()

	cfg.Addresses = edc.Addresses{
		Management: &svr.URL,
	}
	httpClient, err := edchttp.NewHTTPClient(&authToken)
	assert.NoError(t, err, "failed to initialize Http Client")
	cfg.HTTPClient = httpClient

	apiClient, err := New(*cfg)
	assert.NoError(t, err, "failed to initialize api client")

	uid := "a2123-b144123-c1242"
	assignee := "edc-user-1"
	assigner := "edc-user-2"
	policyId := "1234"
	createPolicyOutput, apiError, err := apiClient.CreatePolicy(
		CreatePolicyInput{
			Id: &policyId,
			Policy: Policy{
				Assignee: &assignee,
				Assigner: &assigner,
				UID:      &uid,
			},
		},
	)
	assert.NoError(t, err, "failed to create asset.")
	assert.NotNil(t, createPolicyOutput)
	assert.Nil(t, apiError)
	assert.Equal(t, createPolicyOutput.Id, policyId)
	assert.Equal(t, createPolicyOutput.CreatedAt, int64(1680004526))
}

func Test_CreatePolicyInternalServerError(t *testing.T) {
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500)
		fmt.Fprintf(w, `
[
	{
		"invalidValue": "internal server error",
		"message": "internal server error",
		"path": "/policydefinitions/",
		"path": "POST"
	}
]
`)
	}))
	defer svr.Close()

	cfg := edc.NewConfig()

	cfg.Addresses = edc.Addresses{
		Management: &svr.URL,
	}
	httpClient, err := edchttp.NewHTTPClient(&authToken)
	assert.NoError(t, err, "failed to initialize Http Client")
	cfg.HTTPClient = httpClient

	apiClient, err := New(*cfg)
	assert.NoError(t, err, "failed to initialize api client")

	createdPolicy, apiError, err := apiClient.CreatePolicy(CreatePolicyInput{})

	assert.NoError(t, err, "failed to list policies.")
	assert.NotNil(t, apiError)
	assert.Nil(t, createdPolicy)
	assert.Equal(t, len(apiError), 1)
}
