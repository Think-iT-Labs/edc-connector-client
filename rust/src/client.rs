use std::{collections::HashMap, pin::Pin, str::FromStr};

use anyhow::anyhow;
use async_trait::async_trait;
use bytes::Bytes;
use futures::{Stream, StreamExt};
use reqwest::{
    Client as ReqwestClient, ClientBuilder as ReqwestClientBuilder, Method, Response, Url,
};
use serde::de::DeserializeOwned;

#[async_trait]
pub trait Requester {
    async fn request<T: DeserializeOwned>(
        &self,
        base_url: &String,
        input: InnerRequest<'_>,
    ) -> anyhow::Result<T>;

    async fn request_empty(&self, base_url: &String, input: InnerRequest<'_>)
        -> anyhow::Result<()>;

    async fn request_stream(
        &self,
        base_url: &String,
        input: InnerRequest<'_>,
    ) -> anyhow::Result<Pin<Box<dyn Stream<Item = anyhow::Result<Bytes>>>>>;
}

#[derive(Debug)]
pub struct Client(ReqwestClient);

pub struct ClientBuilder(ReqwestClientBuilder);

#[derive(Debug)]
pub struct InnerRequest<'a> {
    pub method: Method,
    pub path: &'a str,
    pub api_token: Option<&'a str>,
    pub body: Option<serde_json::Value>,
    pub headers: Option<HashMap<String, String>>,
}

impl Client {
    pub fn builder() -> ClientBuilder {
        ClientBuilder(ReqwestClientBuilder::new())
    }

    async fn inner_request(
        &self,
        base_url: &String,
        input: InnerRequest<'_>,
    ) -> anyhow::Result<Response> {
        let mut request = self.0.request(
            input.method,
            Url::from_str(&format!("{}{}", base_url, input.path))?,
        );

        if let Some(headers) = input.headers {
            for (key, value) in headers {
                request = request.header(key, value);
            }
        }

        if let Some(api_token) = input.api_token {
            request = request.header("Authorization", api_token);
        }

        Ok(request
            .json(&input.body.unwrap_or(().into()))
            .send()
            .await?)
    }
}

#[async_trait]
impl Requester for Client {
    async fn request<T: DeserializeOwned>(
        &self,
        base_url: &String,
        input: InnerRequest<'_>,
    ) -> anyhow::Result<T> {
        Ok(self.inner_request(&base_url, input).await?.json().await?)
    }

    async fn request_empty(
        &self,
        base_url: &String,
        input: InnerRequest<'_>,
    ) -> anyhow::Result<()> {
        self.inner_request(&base_url, input).await?;

        Ok(())
    }

    async fn request_stream(
        &self,
        base_url: &String,
        input: InnerRequest<'_>,
    ) -> anyhow::Result<Pin<Box<dyn Stream<Item = anyhow::Result<Bytes>>>>> {
        Ok(Box::pin(
            self.inner_request(&base_url, input)
                .await?
                .bytes_stream()
                .map(|maybe_chunk| maybe_chunk.map_err(|_| anyhow!("some chunk error"))),
        ))
    }
}

impl ClientBuilder {
    pub fn build(self) -> anyhow::Result<Client> {
        Ok(Client(self.0.build()?))
    }
}
