package assets

type AssetProperties struct {
	Id                string            `json:"@id"`
	PublicProperties  map[string]string `json:"edc:properties"`
	PrivateProperties map[string]string `json:"edc:privateProperties"`
}
