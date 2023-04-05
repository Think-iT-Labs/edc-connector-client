use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Addresses {
    pub default: String,
    pub management: String,
    pub protocol: String,
    pub public: String,
    pub control: String,
}
