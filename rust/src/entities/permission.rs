use serde::{Deserialize, Serialize};

use super::{action::Action, constraint::Constraint, duty::Duty};

#[derive(Clone, Deserialize, Serialize)]
pub struct Permission {
    pub assignee: Option<String>,
    pub assigner: Option<String>,
    pub duties: Vec<Duty>,
    pub target: Option<String>,
    pub uid: Option<String>,
    pub constraints: Vec<Constraint>,
    pub action: Option<Action>,
    pub edctype: String,
}
