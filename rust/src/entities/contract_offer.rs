use serde::{Deserialize, Serialize};

use super::{asset::Asset, policy::Policy};

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractOffer {
    pub asset: Option<Asset>,
    pub policy: Option<Policy>,
    pub consumer: Option<String>,
    pub provider: Option<String>,
    pub contract_end: Option<String>,
    pub contract_start: Option<String>,
    pub id: Option<String>,
    pub offer_end: Option<String>,
    pub offer_start: Option<String>,
}
