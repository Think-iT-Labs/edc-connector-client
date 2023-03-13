use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::{duty::Duty, permission::Permission, prohibition::Prohibition};

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum AtPolicyType {
    Set,
    Offer,
    Contract,
}

#[derive(Clone, Deserialize, Serialize)]
pub struct AtType {
    #[serde(rename = "@policytype")]
    pub at_policy_type: AtPolicyType,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Policy {
    pub uid: Option<String>,
    #[serde(rename = "@type")]
    pub at_type: Option<AtType>,
    pub assignee: Option<String>,
    pub assigner: Option<String>,
    pub extensible_properties: HashMap<String, String>,
    pub inherits_from: Option<String>,
    pub obligations: Vec<Duty>,
    pub permissions: Vec<Permission>,
    pub prohibitions: Vec<Prohibition>,
    pub target: Option<String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PolicyDefinition {
    pub id: String,
    pub created_at: u64,
    pub policy: Policy,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PolicyDefinitionInput {
    pub id: Option<String>,
    pub policy: Policy,
}
