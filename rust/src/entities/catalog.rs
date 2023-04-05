use serde::{Deserialize, Serialize};

use crate::entities::QuerySpec;

use super::contract_offer::ContractOffer;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Catalog {
    pub id: String,
    pub contract_offers: Vec<ContractOffer>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CatalogRequest {
    pub provider_url: String,
    pub query_spec: Option<QuerySpec>,
}
