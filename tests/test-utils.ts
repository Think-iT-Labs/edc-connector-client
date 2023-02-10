import * as crypto from "node:crypto";
import * as events from "node:events";
import * as http from "node:http";
import {
  AssetInput,
  ContractAgreement,
  ContractDefinitionInput,
  ContractNegotiation,
  ContractOffer,
  CreateResult,
  EdcConnectorClient,
  EdcConnectorClientContext,
  Policy,
  PolicyDefinitionInput,
  TransferProcessResponse,
} from "../src";

interface ContractNegotiationMetadata {
  assetId: string;
  policyId: string;
  contractDefinitionId: string;
  createResult: CreateResult;
}

interface ContractAgreementMetadata {
  assetId: string;
  policyId: string;
  contractDefinitionId: string;
  contractNegotiation: ContractNegotiation;
  contractAgreement: ContractAgreement;
}

export async function createContractAgreement(
  client: EdcConnectorClient,
  providerContext: EdcConnectorClientContext,
  consumerContext: EdcConnectorClientContext,
): Promise<ContractAgreementMetadata> {
  const { createResult, ...rest } = await createContractNegotiation(
    client,
    providerContext,
    consumerContext,
  );

  await waitForNegotiationState(
    client,
    consumerContext,
    createResult.id,
    "CONFIRMED",
  );

  const contractNegotiation = await client.management.getNegotiation(
    consumerContext,
    createResult.id,
  );

  return {
    ...rest,
    contractNegotiation,
    contractAgreement: await client.management.getAgreement(
      consumerContext,
      contractNegotiation.contractAgreementId as string,
    ),
  };
}

export async function createContractNegotiation(
  client: EdcConnectorClient,
  providerContext: EdcConnectorClientContext,
  consumerContext: EdcConnectorClientContext,
): Promise<ContractNegotiationMetadata> {
  // Register dataplanes
  client.management.registerDataplane(providerContext, {
    "id": "provider-dataplane",
    "url": "http://provider-connector:9192/control/transfer",
    "allowedSourceTypes": ["HttpData"],
    "allowedDestTypes": ["HttpProxy", "HttpData"],
    "properties": {
      "publicApiUrl": "http://provider-connector:9291/public/",
    },
  });

  client.management.registerDataplane(consumerContext, {
    "id": "consumer-dataplane",
    "url": "http://consumer-connector:9192/control/transfer",
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
  await client.management.createAsset(providerContext, assetInput);

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
  await client.management.createPolicy(providerContext, policyInput);

  // Crate contract definition on the provider's side
  const contractDefinitionId = crypto.randomUUID();
  const contractDefinitionInput: ContractDefinitionInput = {
    id: contractDefinitionId,
    accessPolicyId: policyId,
    contractPolicyId: policyId,
    criteria: [],
  };
  await client.management.createContractDefinition(
    providerContext,
    contractDefinitionInput,
  );

  // Retrieve catalog and select contract offer
  const catalog = await client.management.requestCatalog(consumerContext, {
    providerUrl: `${providerContext.protocol}/data`,
  });
  const contractOffer = catalog.contractOffers.find((offer) =>
    offer.asset?.id === assetId
  ) as ContractOffer;

  // Initiate contract negotiation on the consumer's side
  const createResult = await client.management
    .initiateContractNegotiation(consumerContext, {
      connectorAddress: `${providerContext.protocol}/data`,
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

export async function waitForNegotiationState(
  client: EdcConnectorClient,
  context: EdcConnectorClientContext,
  negotiationId: string,
  targetState: string,
  interval = 500,
): Promise<void> {
  let waiting = true;

  do {
    await new Promise((resolve) => setTimeout(resolve, interval));

    const { state } = await client.management.getNegotiationState(
      context,
      negotiationId,
    );

    waiting = state !== targetState;
  } while (waiting);
}

export function createReceiverServer() {
  const emitter = new events.EventEmitter();

  const server = http.createServer(async (req, res) => {
    const body = await new Promise<TransferProcessResponse>(
      (resolve, reject) => {
        let chunks: any[] = [];

        req
          .on("data", (chunk) => chunks.push(chunk))
          .on("error", (error) => reject(error))
          .on("end", () => {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          });
      },
    );

    if (body.properties?.cid) {
      emitter.emit(body.properties.cid, body);
    }

    res.statusCode = 204;
    res.end();
  });

  return {
    waitForEvent(id: string): Promise<TransferProcessResponse> {
      return new Promise((resolve) => {
        emitter.on(id, resolve);
      });
    },
    listen(): Promise<void> {
      return new Promise((resolve) => {
        server.listen(19999, resolve);
      });
    },
    shutdown(): Promise<void> {
      return new Promise((resolve, reject) => {
        if (server.listening) {
          server.close((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      });
    },
  };
}
