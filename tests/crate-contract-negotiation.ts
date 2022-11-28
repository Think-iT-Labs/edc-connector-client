import * as crypto from "node:crypto";
import {
  AssetInput,
  ContractDefinitionInput,
  ContractOffer,
  CreateResult,
  EdcClient,
  EdcClientContext,
  Policy,
  PolicyDefinitionInput,
} from "../src";

interface ContractNegotiationMetadata {
  assetId: string;
  policyId: string;
  contractDefinitionId: string;
  createResult: CreateResult;
}

export async function createContractNegotiation(
  client: EdcClient,
  providerContext: EdcClientContext,
  consumerContext: EdcClientContext,
): Promise<ContractNegotiationMetadata> {
  // Register dataplanes
  client.dataplane.registerDataplane(providerContext, {
    "edctype": "dataspaceconnector:dataplaneinstance",
    "id": "provider-dataplane",
    "url": "http://provider-connector:9292/control/transfer",
    "allowedSourceTypes": ["HttpData"],
    "allowedDestTypes": ["HttpProxy", "HttpData"],
    "properties": {
      "publicApiUrl": "http://provider-connector:9291/public/",
    },
  });

  client.dataplane.registerDataplane(consumerContext, {
    "edctype": "dataspaceconnector:dataplaneinstance",
    "id": "consumer-dataplane",
    "url": "http://consumer-connector:9292/control/transfer",
    "allowedSourceTypes": ["HttpData"],
    "allowedDestTypes": ["HttpProxy", "HttpData"],
    "properties": {
      "publicApiUrl": "http://consumer-connector:9291/public/",
    },
  });

  // Crate asset on the provider's side
  const assetId = crypto.randomUUID();
  const assetInput: AssetInput = {
    asset: {
      properties: {
        "asset:prop:id": assetId,
        "asset:prop:name": "product description",
        "asset:prop:contenttype": "application/json",
      },
    },
    dataAddress: {
      properties: {
        name: "Test asset",
        baseUrl: "https://jsonplaceholder.typicode.com/users",
        type: "HttpData",
      },
    },
  };
  await client.data.createAsset(providerContext, assetInput);

  // Crate policy on the provider's side
  const policyId = crypto.randomUUID();
  const policyInput: PolicyDefinitionInput = {
    id: policyId,
    policy: {
      "uid": "231802-bb34-11ec-8422-0242ac120002",
      "permissions": [
        {
          "target": assetId,
          "action": {
            "type": "USE",
          },
          "edctype": "dataspaceconnector:permission",
        },
      ],
      "@type": {
        "@policytype": "set",
      },
    },
  };
  await client.data.createPolicy(providerContext, policyInput);

  // Crate contract definition on the provider's side
  const contractDefinitionId = crypto.randomUUID();
  const contractDefinitionInput: ContractDefinitionInput = {
    id: contractDefinitionId,
    accessPolicyId: policyId,
    contractPolicyId: policyId,
    criteria: [],
  };
  await client.data.createContractDefinition(
    providerContext,
    contractDefinitionInput,
  );

  // Retrieve catalog and select contract offer
  const catalog = await client.data.requestCatalog(consumerContext, {
    providerUrl: `${providerContext.ids}/api/v1/ids/data`,
  });
  const contractOffer = catalog.contractOffers.find((offer) =>
    offer.asset?.id === assetId
  ) as ContractOffer;

  // Initiate contract negotiation on the consumer's side
  const createResult = await client.data
    .initiateContractNegotiation(consumerContext, {
      connectorAddress: `${providerContext.ids}/api/v1/ids/data`,
      connectorId: "provider",
      offer: {
        offerId: contractOffer.id as string,
        assetId,
        policy: contractOffer.policy as Policy,
      },
      protocol: "ids-multipart",
    });

  return {
    assetId,
    policyId,
    contractDefinitionId,
    createResult,
  };
}
