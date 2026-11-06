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
  providerProtocolUrl: string,
): Promise<ContractAgreementMetadata> {
  const { idResponse, ...rest } = await createContractNegotiation(
    provider,
    consumer,
    providerProtocolUrl
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
  providerProtocolUrl: string
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
    "@type": "PolicyDefinition",
    policy: new PolicyBuilder().type("Set").build(),
  };
  await provider.management.policyDefinitions.create(policyInput);

  const contractDefinitionId = "definition-" + crypto.randomUUID();
  // Crate contract definition on the provider's side
  const contractDefinitionInput: ContractDefinitionInput = {
    "@id": contractDefinitionId,
    "@type": "ContractDefinition",
    accessPolicyId: policyId,
    contractPolicyId: policyId,
    assetsSelector: [],
  };
  await provider.management.contractDefinitions.create(contractDefinitionInput);

  // Retrieve catalog and select contract offer
  const catalog = await consumer.management.catalog.request({
    counterPartyAddress: providerProtocolUrl,
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
    counterPartyAddress: providerProtocolUrl,
    policy: contractOffer,
  });

  return {
    assetId,
    policyId,
    contractDefinitionId,
    idResponse,
  };
}

interface HeldNegotiationMetadata {
  assetId: string;
  consumerNegotiationId: string;
  providerNegotiationId: string;
}

const APPROVAL_SCOPE = "approval.contract.negotiation";

/**
 * Sets up a provider contract negotiation that is held in `REQUESTED` for manual
 * approval, so that `approve` / `reject` can be exercised.
 *
 * A CEL expression bound to the `approval.contract.negotiation` policy scope that
 * always fails is registered on the provider, and the asset's contract policy
 * carries a constraint on that expression. When the consumer initiates the
 * negotiation, the provider's approval evaluation fails and the negotiation is
 * held as pending. The v5 CEL expressions API is not modelled by the client, so
 * it is called directly here.
 */
export async function createNegotiationHeldForApproval(
  provider: EdcConnectorClient,
  consumer: EdcConnectorClient,
  providerProtocolUrl: string,
  providerManagementUrl: string,
  apiToken: string,
): Promise<HeldNegotiationMetadata> {
  const approvalExpression = `https://w3id.org/edc/test/approval/${crypto.randomUUID()}`;

  const celResponse = await fetch(`${providerManagementUrl}/v5/celexpressions`, {
    method: "POST",
    headers: { "X-Api-Key": apiToken, "Content-Type": "application/json" },
    body: JSON.stringify({
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "CelExpression",
      leftOperand: approvalExpression,
      expression: "this.rightOperand != 'required'",
      scopes: [APPROVAL_SCOPE],
      description: "always requires manual approval",
    }),
  });

  if (!celResponse.ok) {
    throw new Error(
      `failed to register approval CEL expression: ${celResponse.status} ${await celResponse.text()}`,
    );
  }

  const assetId = crypto.randomUUID();
  await provider.management.assets.create({
    "@id": assetId,
    "@type": "Asset",
    properties: { "asset:prop:name": "asset requiring approval" },
    dataAddress: {
      type: "HttpData",
      baseUrl: "https://jsonplaceholder.typicode.com/users",
    },
  });

  const accessPolicyId = crypto.randomUUID();
  await provider.management.policyDefinitions.create({
    "@id": accessPolicyId,
    "@type": "PolicyDefinition",
    policy: new PolicyBuilder().type("Set").build(),
  });

  const contractPolicyId = crypto.randomUUID();
  await provider.management.policyDefinitions.create({
    "@id": contractPolicyId,
    "@type": "PolicyDefinition",
    policy: new PolicyBuilder()
      .raw({
        "@type": "Set",
        permission: [
          {
            action: "use",
            constraint: {
              "@type": "AtomicConstraint",
              leftOperand: approvalExpression,
              operator: { "@id": "odrl:eq" },
              rightOperand: "required",
            },
          },
        ],
      })
      .build(),
  });

  const contractDefinitionId = "definition-" + crypto.randomUUID();
  await provider.management.contractDefinitions.create({
    "@id": contractDefinitionId,
    "@type": "ContractDefinition",
    accessPolicyId,
    contractPolicyId,
    // Scope the definition to this asset only, so the approval policy does not
    // leak onto the assets used by the other tests.
    assetsSelector: [
      {
        "@type": "Criterion",
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: assetId,
      },
    ],
  });

  const catalog = await consumer.management.catalog.request({
    counterPartyAddress: providerProtocolUrl,
    counterPartyId: "provider",
  });

  // The asset may also be offered by other (unscoped) contract definitions, so
  // pick the offer carrying this test's approval constraint.
  const offer = catalog.datasets
    .filter((dataset) => dataset.id === assetId)
    .flatMap((dataset) => dataset.offers)
    .find((candidate) => JSON.stringify(candidate).includes(approvalExpression));

  if (!offer) {
    throw new Error("approval offer was not found in the catalog");
  }

  const contractOffer = new PolicyBuilder()
    .raw({ ...offer, assigner: "provider", target: assetId })
    .build();

  const { id: consumerNegotiationId } =
    await consumer.management.contractNegotiations.initiate({
      counterPartyAddress: providerProtocolUrl,
      policy: contractOffer,
    });

  const providerNegotiationId = await waitForHeldProviderNegotiation(
    provider,
    consumerNegotiationId,
  );

  return { assetId, consumerNegotiationId, providerNegotiationId };
}

async function waitForHeldProviderNegotiation(
  provider: EdcConnectorClient,
  correlationId: string,
  interval = 500,
  times = 20,
): Promise<string> {
  for (let i = 0; i < times; i++) {
    const [negotiation] = await provider.management.contractNegotiations.queryAll(
      {
        "@type": "QuerySpec",
        filterExpression: [
          {
            "@type": "Criterion",
            operandLeft: "correlationId",
            operator: "=",
            operandRight: correlationId,
          },
        ],
      },
    );

    if (negotiation) {
      const { state } =
        await provider.management.contractNegotiations.getState(negotiation.id);
      if (state === "REQUESTED") {
        return negotiation.id;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("provider negotiation was not held for approval");
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
