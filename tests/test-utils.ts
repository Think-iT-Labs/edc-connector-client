import * as crypto from "node:crypto";
import * as events from "node:events";
import * as http from "node:http";
import {
  AssetInput,
  ContractAgreement,
  ContractDefinitionInput,
  ContractNegotiation,
  EdcConnectorClient,
  EdcConnectorClientContext,
  IdResponse,
  PolicyDefinitionInput,
  TransferProcessResponse,
} from "../src";

interface ContractNegotiationMetadata {
  assetId: string;
  policyId: string;
  contractDefinitionId: string;
  idResponse: IdResponse;
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
  const { idResponse, ...rest } = await createContractNegotiation(
    client,
    providerContext,
    consumerContext,
  );

  const negotiationId = idResponse.id

  await waitForNegotiationState(
    client,
    consumerContext,
    negotiationId,
    "FINALIZED",
  );

  const contractNegotiation = await client.management.getNegotiation(
    consumerContext,
    negotiationId,
  );

  const contractAgreement = await client.management.getAgreement(
    consumerContext,
    contractNegotiation.contractAgreementId,
  );

  return {
    ...rest,
    contractNegotiation,
    contractAgreement,
  };
}

export async function createContractNegotiation(
  client: EdcConnectorClient,
  providerContext: EdcConnectorClientContext,
  consumerContext: EdcConnectorClientContext,
): Promise<ContractNegotiationMetadata> {
  // Crate asset on the provider's side
  const assetId = crypto.randomUUID();
  const assetInput: AssetInput = {
    asset: {
      "@id": assetId,
      properties: {
        "asset:prop:id": assetId,
        "asset:prop:name": "product description",
        "asset:prop:contenttype": "application/json",
      },
    },
    dataAddress: {
      name: "Test asset",
      baseUrl: "https://jsonplaceholder.typicode.com/users",
      type: "HttpData",
    },
  };
  await client.management.createAsset(providerContext, assetInput);

  // Crate policy on the provider's side
  const policyId = crypto.randomUUID();
  const policyInput: PolicyDefinitionInput = {
    "@id": policyId,
    policy: {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      permissions: [],
    },
  };
  await client.management.createPolicy(providerContext, policyInput);

  const contractDefinitionId = "definition-" + crypto.randomUUID();
  // Crate contract definition on the provider's side
  const contractDefinitionInput: ContractDefinitionInput = {
    "@id": contractDefinitionId,
    accessPolicyId: policyId,
    contractPolicyId: policyId,
    assetsSelector: [],
  };
  await client.management.createContractDefinition(
    providerContext,
    contractDefinitionInput,
  );

  // Retrieve catalog and select contract offer
  const catalog = await client.management.requestCatalog(consumerContext, {
    providerUrl: providerContext.protocol,
  });


  const offer = catalog
    .datasets
    .flatMap(it => it.offers)
    .find(offer => offer.assetId === assetId)!;

  offer['@id'] = offer._compacted['@id'];
  offer._compacted = undefined;

  // Initiate contract negotiation on the consumer's side
  const idResponse = await client.management.initiateContractNegotiation(
    consumerContext,
    {
      connectorAddress: providerContext.protocol,
      connectorId: "provider",
      providerId: "provider",
      offer: {
        offerId: offer.id,
        assetId: assetId,
        policy: offer,
      },
    },
  );

  return {
    assetId,
    policyId,
    contractDefinitionId,
    idResponse,
  };
}

export async function waitForNegotiationState(
  client: EdcConnectorClient,
  context: EdcConnectorClientContext,
  negotiationId: string,
  targetState: string,
  interval = 500,
  times = 10,
): Promise<void> {
  let waiting = true;
  let actualState: string;

  do {
    times--;
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response = await client.management.getNegotiationState(
      context,
      negotiationId,
    );

    actualState = response.state;

    waiting = actualState !== targetState;
  } while (waiting && times > 0);

  expect(actualState).toBe(targetState)

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

    if (body.id) {
      emitter.emit(body.id, body);
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
