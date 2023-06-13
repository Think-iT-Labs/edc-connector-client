package assets

type DataProperties interface {
	IsDataProperties()
}

type HttpData struct {
	Type             *string `json:"type,omitempty"`
	Name             *string `json:"name,omitempty"`
	Path             *string `json:"path,omitempty"`
	Method           *string `json:"method,omitempty"`
	BaseUrl          *string `json:"baseUrl,omitempty"`
	AuthKey          *string `json:"authKey,omitempty"`
	AuthCode         *string `json:"authCode,omitempty"`
	SecretName       *string `json:"secretName,omitempty"`
	ProxyBody        *string `json:"proxyBody,omitempty"`
	ProxyPath        *string `json:"proxyPath,omitempty"`
	ProxyQueryParams *string `json:"proxyQueryParams,omitempty"`
	ProxyMethod      *string `json:"proxyMethod,omitempty"`
	ContentType      *string `json:"contentType,omitempty"`
}

func (HttpData) IsDataProperties() {}

type S3Data struct {
	Type            *string `json:"type,omitempty"`
	Name            *string `json:"name,omitempty"`
	BucketName      *string `json:"bucketName,omitempty"`
	AccessKeyId     *string `json:"accessKeyId,omitempty"`
	SecretAccessKey *string `json:"secretAccessKey,omitempty"`
}

func (S3Data) IsDataProperties() {}

type AzureData struct {
	Type      *string `json:"type,omitempty"`
	Container *string `json:"container,omitempty"`
	Account   *string `json:"account,omitempty"`
	BlobName  *string `json:"blobname,omitempty"`
}

func (AzureData) IsDataProperties() {}

type CustomData map[string]interface{}

func (CustomData) IsDataProperties() {}

type AssetApiInput struct {
	AssetProperties map[string]string `json:"properties,omitempty"`
}

type DataAddressApiInput struct {
	DataProperties `json:"properties,omitempty"`
}

type CreateAssetApiInput struct {
	AssetApiInput       `json:"asset,omitempty"`
	DataAddressApiInput `json:"dataAddress,omitempty"`
}

type AssetDataAddressOutput struct {
	AssetProperties map[string]string `json:"properties"`
}
