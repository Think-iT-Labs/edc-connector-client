package sharedtypes

type BaseRequest struct {
	Context map[string]string `json:"@context"`
	Id      string            `json:"@id"`
}

type BaseResponse struct {
	Context   map[string]string `json:"@context"`
	CreatedAt int64             `json:"edc:createdAt"`
	Id        string            `json:"@id"`
	DataType  string            `json:"@type"`
}

var EdcContext map[string]string = map[string]string{
	"edc": "https://w3id.org/edc/v0.0.1/ns/",
}
