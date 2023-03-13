pub mod action;
pub mod addresses;
pub mod asset;
pub mod catalog;
pub mod constraint;
pub mod contract_agreement;
pub mod contract_definition;
pub mod contract_negotiation;
pub mod contract_offer;
pub mod criterion;
pub mod data_address;
pub mod dataplane;
pub mod duty;
pub mod health;
pub mod permission;
pub mod policy;
pub mod prohibition;
pub mod transfer_process;

use serde::{Deserialize, Serialize};

use self::criterion::Criterion;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateResult {
    pub created_at: u64,
    pub id: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum SortOrder {
    Asc,
    Desc,
}

#[derive(Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QuerySpec {
    pub filter: Option<String>,
    pub filter_expression: Option<Vec<Criterion>>,
    pub limit: Option<u64>,
    pub offset: Option<u64>,
    pub sort_field: Option<String>,
    pub sort_order: Option<SortOrder>,
}
