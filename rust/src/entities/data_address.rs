use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct DataAddressProps {
    pub properties: DataAddress,
}

#[derive(Clone, Deserialize, Serialize)]
pub struct DataAddress {
    #[serde(flatten)]
    pub others: HashMap<String, String>,
    #[serde(flatten)]
    pub kind: Option<DataAddressType>,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(tag = "type")]
pub enum DataAddressType {
    HttpData,
    AzureStorage,
    AmazonS3,
}
