package assets

type AssetProperties struct {
	Id                string            `json:"-"`
	PublicProperties  map[string]string `json:"edc:properties"`
	PrivateProperties map[string]string `json:"edc:privateProperties,omitempty"`
}
