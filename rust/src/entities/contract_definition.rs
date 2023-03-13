use serde::{Deserialize, Serialize};

use super::criterion::Criterion;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractDefinition {
    pub id: String,
    pub access_policy_id: String,
    pub contract_policy_id: String,
    pub criteria: Vec<Criterion>,
}

pub type ContractDefinitionInput = ContractDefinition;
