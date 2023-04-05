package policies

type PolicyType string

const (
	SetPolicyType      PolicyType = "set"
	OfferPolicyType    PolicyType = "offer"
	ContractPolicyType PolicyType = "contract"
)

type ExtensibleProperties map[string]string

type Constraint struct {
	EdcType string `json:"edctype,omitempty"`
}

type Action struct {
	Constraint *Constraint `json:"constraint,omitempty"`
	IncludedIn *string     `json:"includedIn,omitempty"`
	ActionType *string     `json:"type,omitempty"`
}

type Permission struct {
	Assignee    *string       `json:"assignee,omitempty"`
	Assigner    *string       `json:"assigner,omitempty"`
	Duties      *[]Duty       `json:"duties,omitempty"`
	Target      *string       `json:"traget,omitempty"`
	UID         *string       `json:"uid,omitempty"`
	Constraints *[]Constraint `json:"constraints,omitempty"`
	Action      *Action       `json:"action,omitempty"`
	EdcType     *string       `json:"edctype,omitempty"`
}

type Duty struct {
	Assignee         *string       `json:"assignee,omitempty"`
	Assigner         *string       `json:"assigner,omitempty"`
	Consequence      *Duty         `json:"consequence,omitempty"`
	Target           *string       `json:"traget,omitempty"`
	UID              *string       `json:"uid,omitempty"`
	Constraints      *[]Constraint `json:"constraints,omitempty"`
	ParentPermission Permission    `json:"parentPermission,omitempty"`
	Action           *Action       `json:"action,omitempty"`
}

type Prohibition struct {
	Assignee    *string       `json:"assignee,omitempty"`
	Assigner    *string       `json:"assigner,omitempty"`
	Target      *string       `json:"traget,omitempty"`
	UID         *string       `json:"uid,omitempty"`
	Constraints *[]Constraint `json:"constraints,omitempty"`
	Action      *Action       `json:"action,omitempty"`
}

type Policy struct {
	UID                  *string               `json:"uid,omitempty"`
	Type                 map[string]PolicyType `json:"@type,omitempty"`
	Assignee             *string               `json:"assignee,omitempty"`
	Assigner             *string               `json:"assigner,omitempty"`
	ExtensibleProperties *ExtensibleProperties `json:"extensibleProperties,omitempty"`
	InheritsFrom         *string               `json:"inheritsFrom,omitempty"`
	Obligations          []Duty                `json:"obligations,omitempty"`
	Permissions          []Permission          `json:"permissions,omitempty"`
	Prohibitions         []Prohibition         `json:"prohibitions,omitempty"`
	Target               *string               `json:"traget,omitempty"`
}

type PolicyDefinition struct {
	Id        string `json:"id,omitempty"`
	CreatedAt int64  `json:"createdAt,omitempty"`
	Policy    Policy `json:"policy,omitempty"`
}

type ApiErrorDetail struct {
	InvalidValue *string `json:"invalidValue,omitempty"`
	Message      *string `json:"message,omitempty"`
	Path         *string `json:"path,omitempty"`
	Type         *string `json:"type,omitempty"`
}
