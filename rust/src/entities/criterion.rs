use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Criterion {
    pub operand_left: String,
    pub operand_right: Option<String>,
    pub operator: String,
}
