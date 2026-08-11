import * as crypto from "node:crypto";
import {
  AssetInput,
  ContractAgreement,
  ContractDefinitionInput,
  ContractNegotiation,
  EdcConnectorClient,
  IdResponse,
  PolicyBuilder,
  PolicyDefinitionInput,
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
  provider: EdcConnectorClient,
  consumer: EdcConnectorClient,
): Promise<ContractAgreementMetadata> {
  const { idResponse, ...rest } = await createContractNegotiation(
    provider,
    consumer,
  );

  const negotiationId = idResponse.id;

  await waitForNegotiationState(consumer, negotiationId, "FINALIZED");

  const contractNegotiation =
    await consumer.management.contractNegotiations.get(negotiationId);

  const contractAgreement = await consumer.management.contractAgreements.get(
    contractNegotiation.contractAgreementId,
  );

  return {
    ...rest,
    contractNegotiation,
    contractAgreement,
  };
}

export async function createContractNegotiation(
  provider: EdcConnectorClient,
  consumer: EdcConnectorClient,
): Promise<ContractNegotiationMetadata> {
  // Crate asset on the provider's side
  const assetId = crypto.randomUUID();
  const assetInput: AssetInput = {
    "@id": assetId,
    "@type": "Asset",
    properties: {
      "asset:prop:id": assetId,
      "asset:prop:name": "product description",
      "asset:prop:contenttype": "application/json",
    },
    dataAddress: {
      name: "Test asset",
      baseUrl: "https://jsonplaceholder.typicode.com/users",
      type: "HttpData",
    },
  };
  await provider.management.assets.create(assetInput);

  // Crate policy on the provider's side
  const policyId = crypto.randomUUID();
  const policyInput: PolicyDefinitionInput = {
    "@id": policyId,
    policy: new PolicyBuilder().type("Set").build(),
  };
  await provider.management.policyDefinitions.create(policyInput);

  const contractDefinitionId = "definition-" + crypto.randomUUID();
  // Crate contract definition on the provider's side
  const contractDefinitionInput: ContractDefinitionInput = {
    "@id": contractDefinitionId,
    accessPolicyId: policyId,
    contractPolicyId: policyId,
    assetsSelector: [],
  };
  await provider.management.contractDefinitions.create(contractDefinitionInput);

  // Retrieve catalog and select contract offer
  const catalog = await consumer.management.catalog.request({
    counterPartyAddress: provider.addresses.protocol!,
    counterPartyId: "provider",
  });

  const offer = catalog.datasets
    .filter((dataset) => dataset.id === assetId)
    .flatMap((it) => it.offers)[0];

  const contractOffer = new PolicyBuilder()
    .raw({
      ...offer,
      assigner: "provider",
      target: assetId,
    })
    .build();

  // Initiate contract negotiation on the consumer's side
  const idResponse = await consumer.management.contractNegotiations.initiate({
    counterPartyAddress: provider.addresses.protocol!,
    counterPartyId: "provider",
    policy: contractOffer,
  });

  return {
    assetId,
    policyId,
    contractDefinitionId,
    idResponse,
  };
}

export async function waitForNegotiationState(
  client: EdcConnectorClient,
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

    const response =
      await client.management.contractNegotiations.getState(negotiationId);

    actualState = response.state;

    waiting = actualState !== targetState;
  } while (waiting && times > 0);

  expect(actualState).toBe(targetState);
}

export async function waitForTransferState(
  client: EdcConnectorClient,
  id: string,
  targetState: string,
  interval = 500,
  times = 10,
): Promise<void> {
  let waiting = true;
  let actualState: string;

  do {
    times--;
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response = await client.management.transferProcesses.getState(id);

    actualState = response.state;

    waiting = actualState !== targetState;
  } while (waiting && times > 0);

  expect(actualState).toBe(targetState);
}

export async function waitForCatalogs(
  client: EdcConnectorClient,
  targetNumberParticipants: number,
  interval = 500,
  times = 10,
): Promise<void> {
  let waiting = true;
  let actualNumberParticipants = 0;

  do {
    times--;
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response = await client.management.catalogs.queryAll({
      "@type": "QuerySpec",
      limit: 50,
    });

    actualNumberParticipants = response.length;

    waiting = actualNumberParticipants !== targetNumberParticipants;
  } while (waiting && times > 0);

  expect(actualNumberParticipants).toBe(targetNumberParticipants);
}
