package contractdefinition

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/Think-iT-Labs/edc-connector-client/go/edc"
	edchttp "github.com/Think-iT-Labs/edc-connector-client/go/edc/transport/http"
	"github.com/stretchr/testify/assert"
)

func TestClient_CreateContractDefinition(t *testing.T) {
	type args struct {
		cd ContractDefinition
	}
	tests := []struct {
		name    string
		args    args
		want    *CreateContractDefinitionOutput
		wantErr bool
	}{
		{
			name: "cread contract definition",
			args: args{
				cd: ContractDefinition{
					Id:               "1234",
					AccessPolicyId:   "1234",
					ContractPolicyId: "1234",
					Criteria:         make([]Criterion, 0),
				},
			},
			want: &CreateContractDefinitionOutput{
				CreatedAt: 1680004526,
				Id:        "1234",
			},
			wantErr: false,
		},
	}
	authToken := "dummy"
	svr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		payload, err := io.ReadAll(r.Body)
		assert.NoError(t, err, "error while reading request body")
		assert.JSONEq(t, `
{
	"id": "1234",
	"accessPolicyId": "1234",
	"contractPolicyId": "1234",
	"criteria": []
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

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := apiClient.CreateContractDefinition(tt.args.cd)
			if (err != nil) != tt.wantErr {
				t.Errorf("Client.CreateContractDefinition() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Client.CreateContractDefinition() = %v, want %v", got, tt.want)
			}
		})
	}
}
