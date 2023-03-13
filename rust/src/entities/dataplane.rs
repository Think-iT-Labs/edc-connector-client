use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Dataplane {
    pub id: String,
    pub url: String,
    pub last_active: u64,
    pub turn_count: u64,
    pub allowed_source_types: Vec<String>,
    pub allowed_dest_types: Vec<String>,
    pub properties: HashMap<String, String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DataplaneInput {
    pub id: String,
    pub url: String,
    pub allowed_source_types: Vec<String>,
    pub allowed_dest_types: Vec<String>,
    pub properties: HashMap<String, String>,
}
