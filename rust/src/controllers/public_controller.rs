use std::collections::HashMap;

use async_trait::async_trait;
use bytes::Bytes;
use futures::Stream;
use reqwest::Method;

use crate::{
    client::{Client, InnerRequest, Requester},
    context::Context,
};

#[async_trait]
pub trait PublicController {
    async fn get_tranfered_data(
        &self,
        context: &Context<'_>,
        headers: HashMap<String, String>,
    ) -> anyhow::Result<Box<dyn Stream<Item = anyhow::Result<Bytes>>>>;
}

#[async_trait]
impl PublicController for Client {
    async fn get_tranfered_data(
        &self,
        context: &Context<'_>,
        headers: HashMap<String, String>,
    ) -> anyhow::Result<Box<dyn Stream<Item = anyhow::Result<Bytes>>>> {
        Ok(self
            .request_stream(
                &context.addresses.public,
                InnerRequest {
                    headers: Some(headers),
                    body: None,
                    path: &"/",
                    method: Method::GET,
                    api_token: None,
                },
            )
            .await?)
    }
}
