use async_trait::async_trait;
use reqwest::Method;

use crate::{
    client::{Client, InnerRequest, Requester},
    context::Context,
    entities::{
        asset::{Asset, AssetInput},
        catalog::{Catalog, CatalogRequest},
        contract_agreement::ContractAgreement,
        contract_definition::{ContractDefinition, ContractDefinitionInput},
        contract_negotiation::{
            ContractNegotiation, ContractNegotiationRequest, ContractNegotiationState,
        },
        dataplane::{Dataplane, DataplaneInput},
        policy::{PolicyDefinition, PolicyDefinitionInput},
        transfer_process::{TransferProcess, TransferProcessInput},
        CreateResult, QuerySpec,
    },
};

#[async_trait]
pub trait ManagementController {
    async fn cancel_negotiation(&self, context: &Context<'_>, id: &String) -> anyhow::Result<()>;

    async fn create_asset(
        &self,
        context: &Context<'_>,
        input: &AssetInput,
    ) -> anyhow::Result<CreateResult>;

    async fn create_contract_definition(
        &self,
        context: &Context<'_>,
        input: &ContractDefinitionInput,
    ) -> anyhow::Result<CreateResult>;

    async fn create_policy_definition(
        &self,
        context: &Context<'_>,
        input: &PolicyDefinitionInput,
    ) -> anyhow::Result<CreateResult>;

    async fn delete_asset(&self, context: &Context<'_>, id: &String) -> anyhow::Result<()>;

    async fn delete_contract_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<()>;

    async fn delete_policy_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<()>;

    async fn get_agreement(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractAgreement>;

    async fn get_agreement_for_negotiation(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractAgreement>;

    async fn get_asset(&self, context: &Context<'_>, id: &String) -> anyhow::Result<Asset>;

    async fn get_contract_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractDefinition>;

    async fn get_negotiation(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractNegotiation>;

    async fn get_negotiation_state(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractNegotiationState>;

    async fn get_policy_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<PolicyDefinition>;

    async fn initiate_contract_negotiation(
        &self,
        context: &Context<'_>,
        input: &ContractNegotiationRequest,
    ) -> anyhow::Result<CreateResult>;

    async fn initiate_transfer(
        &self,
        context: &Context<'_>,
        input: &TransferProcessInput,
    ) -> anyhow::Result<CreateResult>;

    async fn list_assets(&self, context: &Context<'_>) -> anyhow::Result<Vec<Asset>>;

    async fn list_dataplanes(&self, context: &Context<'_>) -> anyhow::Result<Vec<Dataplane>>;

    async fn query_all_agreements(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<ContractAgreement>>;

    async fn query_all_contract_definitions(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<ContractDefinition>>;

    async fn query_all_policy_definitions(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<PolicyDefinition>>;

    async fn query_all_transfer_processes(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<TransferProcess>>;

    async fn query_negotiations(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<ContractNegotiation>>;

    async fn register_dataplane(
        &self,
        context: &Context<'_>,
        input: &DataplaneInput,
    ) -> anyhow::Result<()>;

    async fn request_catalog(
        &self,
        context: &Context<'_>,
        input: &CatalogRequest,
    ) -> anyhow::Result<Catalog>;
}

#[async_trait]
impl ManagementController for Client {
    async fn cancel_negotiation(&self, context: &Context<'_>, id: &String) -> anyhow::Result<()> {
        Ok(self
            .request_empty(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractnegotiations/{id}/cancel"),
                    method: Method::POST,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn create_asset(
        &self,
        context: &Context<'_>,
        input: &AssetInput,
    ) -> anyhow::Result<CreateResult> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: Some(serde_json::to_value(input)?),
                    path: "/assets",
                    method: Method::POST,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn create_contract_definition(
        &self,
        context: &Context<'_>,
        input: &ContractDefinitionInput,
    ) -> anyhow::Result<CreateResult> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: Some(serde_json::to_value(input)?),
                    path: "/contractdefinitions",
                    method: Method::POST,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn create_policy_definition(
        &self,
        context: &Context<'_>,
        input: &PolicyDefinitionInput,
    ) -> anyhow::Result<CreateResult> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: Some(serde_json::to_value(input)?),
                    path: "/policydefinitions",
                    method: Method::POST,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn delete_asset(&self, context: &Context<'_>, id: &String) -> anyhow::Result<()> {
        Ok(self
            .request_empty(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/assets/{id}"),
                    method: Method::DELETE,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn delete_contract_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<()> {
        Ok(self
            .request_empty(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractdefinitions/{id}"),
                    method: Method::DELETE,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn delete_policy_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<()> {
        Ok(self
            .request_empty(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/policydefinitions/{id}"),
                    method: Method::DELETE,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_agreement(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractAgreement> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractagreements/{id}"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_agreement_for_negotiation(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractAgreement> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractnegotiations/{id}/agreement"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_asset(&self, context: &Context<'_>, id: &String) -> anyhow::Result<Asset> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/assets/{id}"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_contract_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractDefinition> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractdefinitions/{id}"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_negotiation(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractNegotiation> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractnegotiations/{id}"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_negotiation_state(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<ContractNegotiationState> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/contractnegotiations/{id}/state"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn get_policy_definition(
        &self,
        context: &Context<'_>,
        id: &String,
    ) -> anyhow::Result<PolicyDefinition> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: &format!("/policydefinitions/{id}"),
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn initiate_contract_negotiation(
        &self,
        context: &Context<'_>,
        input: &ContractNegotiationRequest,
    ) -> anyhow::Result<CreateResult> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/contractnegotiations",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(input)?),
                },
            )
            .await?)
    }

    async fn initiate_transfer(
        &self,
        context: &Context<'_>,
        input: &TransferProcessInput,
    ) -> anyhow::Result<CreateResult> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/transferprocess",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(input)?),
                },
            )
            .await?)
    }

    async fn list_assets(&self, context: &Context<'_>) -> anyhow::Result<Vec<Asset>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    body: None,
                    path: "/assets",
                    method: Method::GET,
                    api_token: Some(&context.api_key),
                },
            )
            .await?)
    }

    async fn list_dataplanes(&self, context: &Context<'_>) -> anyhow::Result<Vec<Dataplane>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::GET,
                    path: "/instances",
                    api_token: Some(&context.api_key),
                    body: None,
                },
            )
            .await?)
    }

    async fn query_all_agreements(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<ContractAgreement>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/contractagreements/request",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(query)?),
                },
            )
            .await?)
    }

    async fn query_all_contract_definitions(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<ContractDefinition>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/contractdefinitions/request",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(query)?),
                },
            )
            .await?)
    }

    async fn query_all_policy_definitions(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<PolicyDefinition>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/policydefinitions/request",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(query)?),
                },
            )
            .await?)
    }

    async fn query_all_transfer_processes(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<TransferProcess>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/transferprocess/request",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(query)?),
                },
            )
            .await?)
    }

    async fn query_negotiations(
        &self,
        context: &Context<'_>,
        query: Option<QuerySpec>,
    ) -> anyhow::Result<Vec<ContractNegotiation>> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/contractnegotiations/request",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(query)?),
                },
            )
            .await?)
    }

    async fn register_dataplane(
        &self,
        context: &Context<'_>,
        input: &DataplaneInput,
    ) -> anyhow::Result<()> {
        Ok(self
            .request_empty(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/instances",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(input)?),
                },
            )
            .await?)
    }

    async fn request_catalog(
        &self,
        context: &Context<'_>,
        input: &CatalogRequest,
    ) -> anyhow::Result<Catalog> {
        Ok(self
            .request(
                &context.addresses.management,
                InnerRequest {
                    headers: None,
                    method: Method::POST,
                    path: "/catalog/request",
                    api_token: Some(&context.api_key),
                    body: Some(serde_json::to_value(input)?),
                },
            )
            .await?)
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use crate::{
        entities::{
            action::Action,
            addresses::Addresses,
            asset::{AssetInputProps, AssetProps},
            criterion::Criterion,
            data_address::{DataAddress, DataAddressProps, DataAddressType},
            permission::Permission,
            policy::{AtPolicyType, AtType, Policy},
        },
        test_utils::{
            create_contract_agreement, create_contract_negotiation, wait_for_negotiation_state,
            ContractAgreementMetadata, ContractNegotiationMetadata,
        },
    };

    use super::*;

    #[tokio::test]
    async fn it_create_asset() -> anyhow::Result<()> {
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

        let create_result = client
            .create_asset(
                &context,
                &AssetInput {
                    asset: AssetInputProps {
                        properties: AssetProps {
                            id: uuid::Uuid::new_v4().to_string(),
                            name: "create_test".into(),
                            others: HashMap::default(),
                        },
                    },
                    data_address: DataAddressProps {
                        properties: DataAddress {
                            kind: Some(DataAddressType::HttpData),
                            others: HashMap::from([(
                                String::from("baseUrl"),
                                "https://example.com".into(),
                            )]),
                        },
                    },
                },
            )
            .await?;

        assert!(create_result.created_at > 0);

        Ok(())
    }

    #[tokio::test]
    async fn it_create_contract_definition() -> anyhow::Result<()> {
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

        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        let create_result = client
            .create_contract_definition(
                &context,
                &ContractDefinitionInput {
                    id: uuid::Uuid::new_v4().to_string(),
                    access_policy_id: create_result.id.clone(),
                    contract_policy_id: create_result.id.clone(),
                    criteria: vec![],
                },
            )
            .await?;

        assert!(create_result.created_at > 0);

        Ok(())
    }

    #[tokio::test]
    async fn it_create_policy_definition() -> anyhow::Result<()> {
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

        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        assert!(create_result.created_at > 0);

        Ok(())
    }

    #[tokio::test]
    async fn it_delete_asset() -> anyhow::Result<()> {
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

        let create_result = client
            .create_asset(
                &context,
                &AssetInput {
                    asset: AssetInputProps {
                        properties: AssetProps {
                            id: uuid::Uuid::new_v4().to_string(),
                            name: "create_test".into(),
                            others: HashMap::default(),
                        },
                    },
                    data_address: DataAddressProps {
                        properties: DataAddress {
                            kind: Some(DataAddressType::HttpData),
                            others: HashMap::from([(
                                String::from("baseUrl"),
                                "https://example.com".into(),
                            )]),
                        },
                    },
                },
            )
            .await?;

        client.delete_asset(&context, &create_result.id).await?;

        assert!(client
            .list_assets(&context)
            .await?
            .iter()
            .find(|a| a.id == create_result.id)
            .is_none());

        Ok(())
    }

    #[tokio::test]
    async fn it_delete_policy_definition() -> anyhow::Result<()> {
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

        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        client
            .delete_policy_definition(&context, &create_result.id)
            .await?;

        assert!(client
            .query_all_policy_definitions(&context, None)
            .await?
            .iter()
            .find(|a| a.id == create_result.id)
            .is_none());

        Ok(())
    }

    #[tokio::test]
    async fn it_get_asset() -> anyhow::Result<()> {
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

        let create_result = client
            .create_asset(
                &context,
                &AssetInput {
                    asset: AssetInputProps {
                        properties: AssetProps {
                            id: uuid::Uuid::new_v4().to_string(),
                            name: "create_test".into(),
                            others: HashMap::default(),
                        },
                    },
                    data_address: DataAddressProps {
                        properties: DataAddress {
                            kind: Some(DataAddressType::HttpData),
                            others: HashMap::from([(
                                String::from("baseUrl"),
                                "https://example.com".into(),
                            )]),
                        },
                    },
                },
            )
            .await?;

        let asset = client.get_asset(&context, &create_result.id).await?;

        assert_eq!(asset.id, create_result.id);

        Ok(())
    }

    #[tokio::test]
    async fn it_get_contract_definition() -> anyhow::Result<()> {
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

        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        let contract_definition_input = ContractDefinitionInput {
            id: uuid::Uuid::new_v4().to_string(),
            access_policy_id: create_result.id.clone(),
            contract_policy_id: create_result.id.clone(),
            criteria: vec![],
        };
        let create_result = client
            .create_contract_definition(&context, &contract_definition_input)
            .await?;

        let contract_definition = client
            .get_contract_definition(&context, &create_result.id)
            .await?;

        assert_eq!(contract_definition.id, create_result.id);

        Ok(())
    }

    #[tokio::test]
    async fn it_get_policy_definition() -> anyhow::Result<()> {
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

        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        let policy = client
            .get_policy_definition(&context, &create_result.id)
            .await?;

        assert_eq!(policy.id, create_result.id);

        Ok(())
    }

    #[tokio::test]
    async fn it_list_assets() -> anyhow::Result<()> {
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

        let create_result = client
            .create_asset(
                &context,
                &AssetInput {
                    asset: AssetInputProps {
                        properties: AssetProps {
                            id: uuid::Uuid::new_v4().to_string(),
                            name: "create_test".into(),
                            others: HashMap::default(),
                        },
                    },
                    data_address: DataAddressProps {
                        properties: DataAddress {
                            kind: Some(DataAddressType::HttpData),
                            others: HashMap::from([(
                                String::from("baseUrl"),
                                "https://example.com".into(),
                            )]),
                        },
                    },
                },
            )
            .await?;

        assert!(client
            .list_assets(&context)
            .await?
            .iter()
            .find(|a| a.id == create_result.id)
            .is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_list_dataplanes() -> anyhow::Result<()> {
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
        let mut properties = HashMap::default();

        properties.insert(
            "publicApiUrl".into(),
            "http://consumer-connector:9291/public/".into(),
        );
        let dataplane_input = DataplaneInput {
            id: "consumer-dataplane".into(),
            url: "http://consumer-connector:9192/control/transfer".into(),
            allowed_source_types: vec!["HttpData".into()],
            allowed_dest_types: vec!["HttpProxy".into(), "HttpData".into()],
            properties,
        };

        client
            .register_dataplane(&context, &dataplane_input)
            .await?;

        assert!(client
            .list_dataplanes(&context)
            .await?
            .iter()
            .find(|a| a.id == dataplane_input.id)
            .is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_query_all_contract_definition() -> anyhow::Result<()> {
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
        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        let contract_definition_input = ContractDefinitionInput {
            id: uuid::Uuid::new_v4().to_string(),
            access_policy_id: create_result.id.clone(),
            contract_policy_id: create_result.id.clone(),
            criteria: vec![],
        };
        let create_result = client
            .create_contract_definition(&context, &contract_definition_input)
            .await?;

        assert!(client
            .query_all_contract_definitions(&context, None)
            .await?
            .iter()
            .find(|a| a.id == create_result.id)
            .is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_query_all_policy_definition() -> anyhow::Result<()> {
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
        let policy_input = PolicyDefinitionInput {
            id: Some(uuid::Uuid::new_v4().to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![],
                uid: None,
                at_type: None,
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };

        let create_result = client
            .create_policy_definition(&context, &policy_input)
            .await?;

        assert!(client
            .query_all_policy_definitions(&context, None)
            .await?
            .iter()
            .find(|a| a.id == create_result.id)
            .is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_register_dataplane() -> anyhow::Result<()> {
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
        let mut properties = HashMap::default();

        properties.insert(
            "publicApiUrl".into(),
            "http://consumer-connector:9291/public/".into(),
        );
        let dataplane_input = DataplaneInput {
            id: "consumer-dataplane".into(),
            url: "http://consumer-connector:9192/control/transfer".into(),
            allowed_source_types: vec!["HttpData".into()],
            allowed_dest_types: vec!["HttpProxy".into(), "HttpData".into()],
            properties,
        };

        client
            .register_dataplane(&context, &dataplane_input)
            .await?;

        Ok(())
    }

    #[tokio::test]
    async fn it_request_catalog() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };

        let asset_id = uuid::Uuid::new_v4();
        let asset_input = AssetInput {
            asset: AssetInputProps {
                properties: AssetProps {
                    id: asset_id.to_string(),
                    name: "create_test".into(),
                    others: HashMap::default(),
                },
            },
            data_address: DataAddressProps {
                properties: DataAddress {
                    kind: Some(DataAddressType::HttpData),
                    others: HashMap::from([(
                        String::from("baseUrl"),
                        "https://example.com".into(),
                    )]),
                },
            },
        };
        client.create_asset(&provider_context, &asset_input).await?;

        let policy_definition_id = uuid::Uuid::new_v4();
        let policy_definition_input = PolicyDefinitionInput {
            id: Some(policy_definition_id.to_string()),
            policy: Policy {
                prohibitions: vec![],
                obligations: vec![],
                permissions: vec![Permission {
                    constraints: vec![],
                    duties: vec![],
                    assignee: None,
                    assigner: None,
                    target: Some(asset_id.to_string()),
                    uid: None,
                    action: Some(Action {
                        constraint: None,
                        included_in: None,
                        kind: Some("USE".into()),
                    }),
                    edctype: "dataspaceconnector:permission".into(),
                }],
                uid: Some(policy_definition_id.to_string()),
                at_type: Some(AtType {
                    at_policy_type: AtPolicyType::Set,
                }),
                assignee: None,
                assigner: None,
                extensible_properties: HashMap::default(),
                inherits_from: None,
                target: None,
            },
        };
        client
            .create_policy_definition(&provider_context, &policy_definition_input)
            .await?;

        let contract_definition_id = uuid::Uuid::new_v4();
        let contract_definition_input = ContractDefinitionInput {
            id: contract_definition_id.to_string(),
            access_policy_id: policy_definition_id.to_string(),
            contract_policy_id: policy_definition_id.to_string(),
            criteria: vec![],
        };
        client
            .create_contract_definition(&provider_context, &contract_definition_input)
            .await?;

        let request_catalog_input = CatalogRequest {
            provider_url: format!("{}/data", provider_context.addresses.protocol),
            query_spec: None,
        };
        let catalog = client
            .request_catalog(&consumer_context, &request_catalog_input)
            .await?;

        assert_eq!(catalog.id, String::from("default"));

        Ok(())
    }

    #[tokio::test]
    async fn it_kickstart_a_contract_negotiation() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };

        let ContractNegotiationMetadata { create_result, .. } =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        assert!(create_result.created_at > 0);

        Ok(())
    }

    #[tokio::test]
    async fn it_retrieves_all_contract_negotiations() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };

        let ContractNegotiationMetadata { create_result, .. } =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        let contract_negotiations = client.query_negotiations(&consumer_context, None).await?;
        assert!(contract_negotiations.len() > 0);
        assert!(contract_negotiations
            .iter()
            .find(|contract_negotiation| { contract_negotiation.id == create_result.id })
            .is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_filters_negotiations_on_the_provider_side_based_on_agreements_assed_id(
    ) -> anyhow::Result<()> {
        // given
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };

        let ContractAgreementMetadata {
            contract_negotiation_metadata,
            ..
        } = create_contract_agreement(&client, &provider_context, &consumer_context).await?;

        // when
        let contract_negotiations = client
            .query_negotiations(
                &provider_context,
                Some(QuerySpec {
                    filter_expression: Some(vec![Criterion {
                        operand_left: "contractAgreement.assetId".into(),
                        operand_right: Some(contract_negotiation_metadata.asset_id),
                        operator: "=".into(),
                    }]),
                    ..Default::default()
                }),
            )
            .await?;

        // then
        assert!(contract_negotiations.first().is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_retrieves_target_contract_negotiation() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };

        let ContractNegotiationMetadata { create_result, .. } =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        let contract_negotiation = client
            .get_negotiation(&consumer_context, &create_result.id)
            .await?;

        assert_eq!(contract_negotiation.id, create_result.id);

        Ok(())
    }

    #[tokio::test]
    async fn it_returns_the_state_of_a_target_negotiation() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };

        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };

        let ContractNegotiationMetadata { create_result, .. } =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        client
            .get_negotiation_state(&consumer_context, &create_result.id)
            .await?;

        Ok(())
    }

    #[tokio::test]
    async fn it_cancel_the_a_requested_target_negotiation() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };
        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };
        let ContractNegotiationMetadata { create_result, .. } =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        // when
        client
            .cancel_negotiation(&consumer_context, &create_result.id)
            .await?;

        wait_for_negotiation_state(
            &client,
            &consumer_context,
            &create_result.id,
            &"ERROR".into(),
        )
        .await?;

        let contract_negotiation = client
            .get_negotiation_state(&consumer_context, &create_result.id)
            .await?;

        assert_eq!(contract_negotiation.state, String::from("ERROR"));

        Ok(())
    }

    #[tokio::test]
    async fn it_returns_the_a_agreement_for_a_target_negotiation() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };
        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };
        let ContractNegotiationMetadata {
            create_result,
            asset_id,
            ..
        } = create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        wait_for_negotiation_state(
            &client,
            &consumer_context,
            &create_result.id,
            &"CONFIRMED".into(),
        )
        .await?;

        // when
        let contract_agreement = client
            .get_agreement_for_negotiation(&consumer_context, &create_result.id)
            .await?;

        // then
        assert_eq!(contract_agreement.asset_id, asset_id);

        Ok(())
    }

    #[tokio::test]
    async fn it_retrieves_all_contract_agreements() -> anyhow::Result<()> {
        let client = Client::builder().build()?;
        let consumer_context = Context {
            addresses: &Addresses {
                default: "http://localhost:19191/api".into(),
                management: "http://localhost:19193/api/v1/data".into(),
                protocol: "http://consumer-connector:9194/api/v1/ids".into(),
                public: "http://localhost:19291/public".into(),
                control: "http://localhost:19292/control".into(),
            },
            api_key: "123456".into(),
        };
        let provider_context = Context {
            addresses: &Addresses {
                default: "http://localhost:29191/api".into(),
                management: "http://localhost:29193/api/v1/data".into(),
                protocol: "http://provider-connector:9194/api/v1/ids".into(),
                public: "http://localhost:29291/public".into(),
                control: "http://localhost:29292/control".into(),
            },
            api_key: "123456".into(),
        };
        let ContractNegotiationMetadata { create_result, .. } =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        wait_for_negotiation_state(
            &client,
            &consumer_context,
            &create_result.id,
            &"CONFIRMED".into(),
        )
        .await?;

        let contract_negotiation = client
            .get_negotiation(&consumer_context, &create_result.id)
            .await?;

        // when
        let contract_agreements = client.query_all_agreements(&consumer_context, None).await?;

        // then
        assert!(contract_agreements.len() > 0);
        assert!(contract_agreements
            .iter()
            .find(|contract_agreement| contract_agreement.id
                == contract_negotiation.contract_agreement_id.clone().unwrap())
            .is_some());

        Ok(())
    }

    #[tokio::test]
    async fn it_initiate_the_transfer_process() -> anyhow::Result<()> {
        // TODO(@fdionisi): how to test the server? Ugh, not as simple as in JavaScript
        Ok(())
    }

    #[tokio::test]
    async fn it_retrieves_all_tranfer_processes() -> anyhow::Result<()> {
        // TODO(@fdionisi): how to test the server? Ugh, not as simple as in JavaScript
        Ok(())
    }
}
