mod client;
mod context;
mod controllers;
pub mod entities;

pub use crate::{
    client::{Client, ClientBuilder},
    context::*,
    controllers::{
        management_controller::ManagementController,
        observability_controller::ObservabilityController, public_controller::PublicController,
    },
};

#[cfg(any(test, feature = "test-utils"))]
mod test_utils {
    use std::{collections::HashMap, time::Duration};

    use super::*;
    use entities::*;

    pub struct ContractNegotiationMetadata {
        pub asset_id: String,
        pub policy_definition_id: String,
        pub contract_definition_id: String,
        pub create_result: CreateResult,
    }

    pub struct ContractAgreementMetadata {
        pub contract_negotiation_metadata: ContractNegotiationMetadata,
        pub contract_negotiation: ContractNegotiation,
        pub contract_agreement: ContractAgreement,
    }

    pub async fn create_contract_negotiation(
        client: &Client,
        provider_context: &Context<'_>,
        consumer_context: &Context<'_>,
    ) -> anyhow::Result<ContractNegotiationMetadata> {
        // Register dataplanes
        client
            .register_dataplane(
                &provider_context,
                &DataplaneInput {
                    id: "provider-dataplane".into(),
                    url: "http://provider-connector:9192/control/transfer".into(),
                    allowed_source_types: vec!["HttpData".into()],
                    allowed_dest_types: vec!["HttpProxy".into(), "HttpData".into()],
                    properties: HashMap::from_iter(vec![(
                        "publicApiUrl".into(),
                        "http://provider-connector:9291/public/".into(),
                    )]),
                },
            )
            .await?;

        client
            .register_dataplane(
                &consumer_context,
                &DataplaneInput {
                    id: "consumer-dataplane".into(),
                    url: "http://consumer-connector:9192/control/transfer".into(),
                    allowed_source_types: vec!["HttpData".into()],
                    allowed_dest_types: vec!["HttpProxy".into(), "HttpData".into()],
                    properties: HashMap::from_iter(vec![(
                        "publicApiUrl".into(),
                        "http://consumer-connector:9291/public/".into(),
                    )]),
                },
            )
            .await?;

        // Crate asset on the provider's side
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

        // Crate policy on the provider's side
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

        // Crate contract definition on the provider's side
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

        // Retrieve catalog and select contract offer
        let catalog = client
            .request_catalog(
                &consumer_context,
                &CatalogRequest {
                    provider_url: format!("{}/data", provider_context.addresses.protocol),
                    query_spec: None,
                },
            )
            .await?;

        let contract_offer = catalog
            .contract_offers
            .iter()
            .find(|offer| offer.asset.as_ref().unwrap().id == asset_id.to_string())
            .unwrap();

        let create_result = client
            .initiate_contract_negotiation(
                &consumer_context,
                &ContractNegotiationRequest {
                    connector_address: format!("{}/data", provider_context.addresses.protocol),
                    connector_id: "provider".into(),
                    offer: ContractNegotiationOffer {
                        offer_id: contract_offer.id.as_ref().unwrap().clone(),
                        asset_id: asset_id.to_string(),
                        policy: contract_offer.policy.as_ref().unwrap().clone(),
                    },
                    protocol: "ids-multipart".into(),
                },
            )
            .await?;

        Ok(ContractNegotiationMetadata {
            asset_id: asset_id.to_string(),
            policy_definition_id: policy_definition_id.to_string(),
            contract_definition_id: contract_definition_id.to_string(),
            create_result,
        })
    }

    pub async fn create_contract_agreement(
        client: &Client,
        provider_context: &Context<'_>,
        consumer_context: &Context<'_>,
    ) -> anyhow::Result<ContractAgreementMetadata> {
        let contract_negotiation_metadata =
            create_contract_negotiation(&client, &provider_context, &consumer_context).await?;

        wait_for_negotiation_state(
            &client,
            &consumer_context,
            &contract_negotiation_metadata.create_result.id,
            &"CONFIRMED".into(),
        )
        .await?;

        let contract_negotiation = client
            .get_negotiation(
                &consumer_context,
                &contract_negotiation_metadata.create_result.id,
            )
            .await?;

        let contract_agreement_id = contract_negotiation.contract_agreement_id.clone();
        Ok(ContractAgreementMetadata {
            contract_negotiation_metadata,
            contract_negotiation,
            contract_agreement: client
                .get_agreement(&consumer_context, &contract_agreement_id.unwrap())
                .await?,
        })
    }

    const INTERVAL: u64 = 500;
    pub async fn wait_for_negotiation_state(
        client: &Client,
        context: &Context<'_>,
        negotiation_id: &String,
        target_state: &String,
    ) -> anyhow::Result<()> {
        loop {
            tokio::time::sleep(Duration::from_millis(INTERVAL)).await;

            let negotiation_state = client
                .get_negotiation_state(&context, &negotiation_id)
                .await?;

            if negotiation_state.state == *target_state {
                break;
            }
        }

        Ok(())
    }
}
