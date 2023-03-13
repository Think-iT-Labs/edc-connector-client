use serde::{Deserialize, Serialize};

use super::{action::Action, constraint::Constraint, permission::Permission};

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Duty {
    pub assignee: Option<String>,
    pub assigner: Option<String>,
    pub consequence: Option<Box<Duty>>,
    pub target: Option<String>,
    pub uid: Option<String>,
    pub constraints: Option<Vec<Constraint>>,
    pub parent_ermission: Option<Permission>,
    pub action: Option<Action>,
}
