use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct DataAddressProps {
    pub properties: DataAddress,
}

#[derive(Deserialize, Serialize)]
pub struct DataAddress {
    #[serde(rename = "type")]
    pub kind: String,
    #[serde(flatten)]
    pub others: HashMap<String, String>,
}
