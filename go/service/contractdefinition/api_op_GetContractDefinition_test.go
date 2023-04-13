package contractdefinition

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func TestClient_GetContractDefinition(t *testing.T) {
	type args struct {
		ContractDefinitionId string
	}
	tests := []struct {
		name    string
		args    args
		want    *ContractDefinition
		wantErr bool
	}{
		{
			name: "get contract definition",
			args: args{
				ContractDefinitionId: "1234",
			},
			want: &ContractDefinition{
				Id:               "1234",
				AccessPolicyId:   "1234",
				ContractPolicyId: "1234",
				Criteria:         make([]Criterion, 0),
				Validity:         31536000,
			},
			wantErr: false,
		},
	}
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `
{
	"id": "1234",
	"accessPolicyId": "1234",
	"contractPolicyId": "1234",
	"criteria": [],
	"validity": 31536000
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
