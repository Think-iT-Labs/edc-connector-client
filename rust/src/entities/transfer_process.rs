use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::data_address::DataAddress;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferProcess {
    pub created_at: u64,
    pub updated_at: u64,
    pub id: String,
    #[serde(rename = "type")]
    pub kind: String, // TODO(@fdionisi): specialise
    pub state: String, // TODO(@fdionisi): specialise
    pub state_timestamp: u64,
    pub error_detail: Option<String>,
    pub data_request: TransferProcessDataRequest,
    data_destination: TransferProcessDataDestination,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferProcessDataRequest {
    pub id: String,
    pub asset_id: String,
    pub contract_id: String,
    pub connector_id: String,
}
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferProcessDataDestination {
    pub properties: HashMap<String, String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferProcessInput {
    pub asset_id: String,
    pub connector_address: String,
    pub connector_id: String,
    pub contract_id: String,
    pub data_destination: DataAddress,
    pub protocol: Option<String>,
    pub transfer_type: Option<TransferType>,
    pub id: Option<String>,
    pub properties: Option<HashMap<String, String>>,
    pub managed_resources: bool,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferType {
    pub content_type: Option<String>,
    pub is_finite: Option<bool>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransferProcessResponse {
    pub id: String,
    pub endpoint: String,
    pub contract_id: String,
    pub auth_key: String,
    pub auth_code: String,
    pub properties: Option<HashMap<String, String>>,
}
