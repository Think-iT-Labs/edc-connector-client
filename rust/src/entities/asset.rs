use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::data_address::DataAddressProps;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Asset {
    pub created_at: u64,
    pub id: String,
    pub properties: AssetProps,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AssetProps {
    #[serde(rename = "asset:prop:id")]
    pub id: String,
    #[serde(rename = "asset:prop:name")]
    pub name: String,
    #[serde(flatten)]
    pub others: HashMap<String, Option<String>>,
}

#[derive(Deserialize, Serialize)]
pub struct AssetInputProps {
    pub properties: AssetProps,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AssetInput {
    pub asset: AssetInputProps,
    pub data_address: DataAddressProps,
}
