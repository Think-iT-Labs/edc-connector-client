use serde::{Deserialize, Serialize};

use super::{action::Action, constraint::Constraint};

#[derive(Clone, Deserialize, Serialize)]
pub struct Prohibition {
    pub assignee: Option<String>,
    pub assigner: Option<String>,
    pub target: Option<String>,
    pub uid: Option<String>,
    pub constraints: Option<Vec<Constraint>>,
    pub action: Option<Action>,
}
