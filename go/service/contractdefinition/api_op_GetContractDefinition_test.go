package contractdefinition

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/Think-iT-Labs/edc-connector-client/go/internal/sdktypes"
	"github.com/stretchr/testify/assert"
)

func TestClient_GetContractDefinition(t *testing.T) {
	type args struct {
		ContractDefinitionId string
	}
	tests := []struct {
		name    string
		args    args
		want    *GetContractDefinitionOutput
		wantErr bool
	}{
		{
			name: "get contract definition",
			args: args{
				ContractDefinitionId: "1234",
			},
			want: &GetContractDefinitionOutput{
				Context: sdktypes.Context{
					"dct":    "https://purl.org/dc/terms/",
					"edc":    "https://w3id.org/edc/v0.0.1/ns/",
					"dcat":   "https://www.w3.org/ns/dcat/",
					"odrl":   "http://www.w3.org/ns/odrl/2/",
					"dspace": "https://w3id.org/dspace/v0.8/",
				},
				Id:               "1234",
				Type:             "edc:ContractDefinition",
				AccessPolicyId:   "accessPolicyId",
				ContractPolicyId: "contractPolicyId",
				Criteria: []GetCriterionOutput{
					{
						Type:         "edc:CriterionDto",
						OperandLeft:  "edc.asset.id",
						OperandRight: "test",
						Operator:     "equals",
					},
				},
			},
			wantErr: false,
		},
	}
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
{
	"@id": "1234",
	"@type": "edc:ContractDefinition",
	"edc:accessPolicyId": "accessPolicyId",
	"edc:contractPolicyId": "contractPolicyId",
	"edc:criteria": {
		"@type": "edc:CriterionDto",
		"edc:operandLeft": "edc.asset.id",
		"edc:operandRight": "test",
		"edc:operator": "equals"
	},
	"@context": {
		"dct": "https://purl.org/dc/terms/",
		"edc": "https://w3id.org/edc/v0.0.1/ns/",
		"dcat": "https://www.w3.org/ns/dcat/",
		"odrl": "http://www.w3.org/ns/odrl/2/",
		"dspace": "https://w3id.org/dspace/v0.8/"
	}
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

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := apiClient.GetContractDefinition(tt.args.ContractDefinitionId)
			if (err != nil) != tt.wantErr {
				t.Errorf("Client.GetContractDefinition() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Client.GetContractDefinition() = %v, want %v", got, tt.want)
			}
		})
	}
}
