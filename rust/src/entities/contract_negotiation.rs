use serde::{Deserialize, Serialize};

use super::policy::Policy;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractNegotiationOffer {
    pub offer_id: String,
    pub asset_id: String,
    pub policy: Policy,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractNegotiationRequest {
    pub connector_address: String,
    pub connector_id: String,
    pub offer: ContractNegotiationOffer,
    pub protocol: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractNegotiation {
    pub id: String,
    pub updated_at: u64,
    pub created_at: u64,
    pub contract_agreement_id: Option<String>,
    pub counter_party_address: Option<String>,
    pub error_detail: Option<String>,
    pub protocol: Option<String>,
    pub state: String,
    #[serde(rename = "type")]
    pub kind: ContractNegotiationKind,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum ContractNegotiationKind {
    Consumer,
    Provider,
}

#[derive(Deserialize, Serialize)]
pub struct ContractNegotiationState {
    pub state: String,
}
