use serde::{Deserialize, Serialize};

use super::constraint::Constraint;

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Action {
    pub constraint: Option<Constraint>,
    pub included_in: Option<String>,
    #[serde(rename = "type")]
    pub kind: Option<String>,
}
