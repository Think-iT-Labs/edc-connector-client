package assets

type DataAddressType string

const (
	DataAddressTypeHttp   DataAddressType = "HttpData"
	DataAddressTypeS3     DataAddressType = "AmazonS3"
	DataAddressTypeAzure  DataAddressType = "AzureStorage"
	DataAddressTypeCustom DataAddressType = "Custom"
)

type DataAddressBase struct {
	Type DataAddressType `json:"edc:type"`
	Name string          `json:"edc:name,omitempty"`
}

type HttpData struct {
	// DataAddressBase
	HttpAssetName    string `json:"edc:name,omitempty"`
	Path             string `json:"path,omitempty"`
	Method           string `json:"method,omitempty"`
	BaseUrl          string `json:"edc:baseUrl,omitempty"`
	AuthKey          string `json:"authKey,omitempty"`
	AuthCode         string `json:"authCode,omitempty"`
	SecretName       string `json:"secretName,omitempty"`
	ProxyBody        string `json:"proxyBody,omitempty"`
	ProxyPath        string `json:"proxyPath,omitempty"`
	ProxyQueryParams string `json:"proxyQueryParams,omitempty"`
	ProxyMethod      string `json:"proxyMethod,omitempty"`
	ContentType      string `json:"contentType,omitempty"`
}

type S3Data struct {
	// DataAddressBase
	S3AssetName     string `json:"edc:name,omitempty"`
	BucketName      string `json:"bucketName,omitempty"`
	AccessKeyId     string `json:"accessKeyId,omitempty"`
	SecretAccessKey string `json:"secretAccessKey,omitempty"`
}

type AzureData struct {
	// DataAddressBase
	Container string `json:"container,omitempty"`
	Account   string `json:"account,omitempty"`
	BlobName  string `json:"blobname,omitempty"`
}

type CustomData map[string]interface{}

// interface that all data assets should implement.
// serves as a make-shift generic type
type DataAddress interface {
	IsDataAddress()
}

func (HttpData) IsDataAddress() {}

func (S3Data) IsDataAddress() {}

func (AzureData) IsDataAddress() {}

func (CustomData) IsDataAddress() {}
