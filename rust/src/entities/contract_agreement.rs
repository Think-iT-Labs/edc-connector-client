use serde::{Deserialize, Serialize};

use super::policy::Policy;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractAgreement {
    pub id: String,
    pub asset_id: String,
    pub consumer_agent_id: String,
    pub contract_end_date: Option<u64>,
    pub constract_signing_date: Option<u64>,
    pub constract_start_date: Option<u64>,
    pub policy: Policy,
    pub provider_agent_id: String,
}
