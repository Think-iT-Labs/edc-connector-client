use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthStatus {
    pub component_results: Vec<HealthCheckResult>,
    pub is_system_healthy: bool,
}

#[derive(Deserialize, Serialize)]
pub struct HealthCheckFailure {
    pub messages: Vec<String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthCheckResult {
    pub failure: Option<HealthCheckFailure>,
    pub component: Option<String>,
    pub is_healthy: bool,
}
