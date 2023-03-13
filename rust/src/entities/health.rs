use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthStatus {
    pub component_results: Vec<HealthCheckResult>,
    pub is_system_healthy: bool,
}

#[derive(Deserialize)]
pub struct HealthCheckFailure {
    pub messages: Vec<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthCheckResult {
    pub failure: Option<HealthCheckFailure>,
    pub component: Option<String>,
    pub is_healthy: bool,
}
