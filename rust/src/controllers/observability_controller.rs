use async_trait::async_trait;
use reqwest::Method;

use crate::{
    client::{Client, InnerRequest, Requester},
    context::Context,
    entities::health::HealthStatus,
};

#[async_trait]
pub trait ObservabilityController {
    async fn check_health(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus>;

    async fn check_liveness(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus>;

    async fn check_readiness(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus>;

    async fn check_startup(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus>;
}

#[async_trait]
impl ObservabilityController for Client {
    async fn check_health(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus> {
        Ok(self
            .request(
                &context.addresses.default,
                InnerRequest {
                    headers: None,
                    body: None,
                    method: Method::GET,
                    path: "/check/health",
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn check_liveness(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus> {
        Ok(self
            .request(
                &context.addresses.default,
                InnerRequest {
                    headers: None,
                    body: None,
                    method: Method::GET,
                    path: "/check/liveness",
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn check_readiness(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus> {
        Ok(self
            .request(
                &context.addresses.default,
                InnerRequest {
                    headers: None,
                    body: None,
                    method: Method::GET,
                    path: "/check/readiness",
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn check_startup(&self, context: &Context<'_>) -> anyhow::Result<HealthStatus> {
        Ok(self
            .request(
                &context.addresses.default,
                InnerRequest {
                    headers: None,
                    body: None,
                    method: Method::GET,
                    path: "/check/startup",
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }
}

#[cfg(test)]
mod tests {
    use crate::Addresses;

    use super::*;

    #[tokio::test]
    async fn it_check_health() -> anyhow::Result<()> {
        let client = Client::builder().build()?;

        let context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let health_status = client.check_health(&context).await?;

        assert!(health_status.is_system_healthy);

        Ok(())
    }

    #[tokio::test]
    async fn it_check_liveness() -> anyhow::Result<()> {
        let client = Client::builder().build()?;

        let context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let health_status = client.check_liveness(&context).await?;

        assert!(health_status.is_system_healthy);

        Ok(())
    }

    #[tokio::test]
    async fn it_check_readiness() -> anyhow::Result<()> {
        let client = Client::builder().build()?;

        let context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let health_status = client.check_readiness(&context).await?;

        assert!(health_status.is_system_healthy);

        Ok(())
    }

    #[tokio::test]
    async fn it_check_startup() -> anyhow::Result<()> {
        let client = Client::builder().build()?;

        let context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let health_status = client.check_startup(&context).await?;

        assert!(health_status.is_system_healthy);

        Ok(())
    }
}
