import * as crypto from "node:crypto";
import { EdcConnectorClient, PolicyBuilder } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  createNegotiationHeldForApproval,
  waitForNegotiationState,
} from "../../test-utils";

async function requestContractNegotiation(provider: EdcConnectorClient, consumer: EdcConnectorClient, providerProtocolUrl: string) {
  return await createContractNegotiation(
    provider,
    consumer,
    providerProtocolUrl,
  );
}

describe("ContractNegotiationController", () => {

  const providerProtocolUrl = "http://provider-connector:9194/protocol/2025-1";
  const providerManagementUrl = "http://localhost:29193/management";
  const apiToken = "123456";

  const v4Consumer = new EdcConnectorClient.Builder()
    .apiToken(apiToken)
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .apiToken(apiToken)
    .managementUrl(providerManagementUrl)
    .build();

  const runContractNegotiationTests = (
    label: string,
    consumer: EdcConnectorClient,
  ): void => {
    describe(label, () => {
      const negotiations = consumer.management.contractNegotiations;

      describe("initiate", () => {
        it("kickstart a contract negotiation", async () => {
          const { idResponse } = await requestContractNegotiation(provider, consumer, providerProtocolUrl);

          expect(idResponse).toHaveProperty("id");
          expect(idResponse).toHaveProperty("createdAt");
        });
      });

      describe("queryAll", () => {
        it("retrieves all contract negotiations", async () => {
          const { idResponse } = await requestContractNegotiation(provider, consumer, providerProtocolUrl);

          const contractNegotiations = await negotiations.queryAll();

          expect(contractNegotiations.length).toBeGreaterThan(0);
          expect(
            contractNegotiations.find(
              (contractNegotiation) => contractNegotiation.id === idResponse.id,
            ),
          ).toBeTruthy();
        });

        it("filters negotiations based on agreements' asset ID", async () => {
          const { assetId } = await createContractAgreement(
            provider,
            consumer,
            providerProtocolUrl,
          );

          const [providerNegotiation] = await negotiations.queryAll({
            "@type": "QuerySpec",
            filterExpression: [
              {
                "@type": "Criterion",
                operandLeft: "contractAgreement.assetId",
                operator: "=",
                operandRight: assetId,
              },
            ],
          });

          expect(providerNegotiation).toBeTruthy();
        });
      });

      describe("get", () => {
        it("retrieves target contract negotiation", async () => {
          const { idResponse } = await requestContractNegotiation(provider, consumer, providerProtocolUrl);

          const contractNegotiation = await negotiations.get(idResponse.id);

          expect(contractNegotiation.id).toEqual(idResponse.id);
        });

        it("fails to fetch a non-existent contract negotiation", async () => {
          const maybeNegotiation = negotiations.get(crypto.randomUUID());

          await expect(maybeNegotiation).rejects.toThrow("resource not found");

          maybeNegotiation.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("getState", () => {
        it("returns the state of a target negotiation", async () => {
          const { idResponse } = await requestContractNegotiation(provider, consumer, providerProtocolUrl);

          const contractNegotiationState = await negotiations.getState(
            idResponse.id,
          );

          expect(contractNegotiationState).toHaveProperty("state");
        });

        it("fails to fetch a non-existent contract negotiation's state", async () => {
          const maybeNegotiation = negotiations.getState(crypto.randomUUID());

          await expect(maybeNegotiation).rejects.toThrow("resource not found");

          maybeNegotiation.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("terminate", () => {
        it("fails to terminate a non-existent contract negotiation", async () => {
          const maybeNegotiation = negotiations.terminate(
            crypto.randomUUID(),
            "a reason to terminate",
          );

          await expect(maybeNegotiation).rejects.toThrow("resource not found");

          maybeNegotiation.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("approve", () => {
        it("approves a held provider contract negotiation", async () => {
          const { consumerNegotiationId, providerNegotiationId } =
            await createNegotiationHeldForApproval(
              provider,
              consumer,
              providerProtocolUrl,
              providerManagementUrl,
              apiToken,
            );

          await expect(
            provider.management.contractNegotiations.approve(
              providerNegotiationId,
            ),
          ).resolves.not.toThrow();

          await waitForNegotiationState(
            consumer,
            consumerNegotiationId,
            "FINALIZED",
          );
        });

        it("fails to approve a non-existent contract negotiation", async () => {
          const maybeNegotiation = negotiations.approve(crypto.randomUUID());

          await expect(maybeNegotiation).rejects.toThrow("resource not found");

          maybeNegotiation.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("reject", () => {
        it("rejects a held provider contract negotiation", async () => {
          const { consumerNegotiationId, providerNegotiationId } =
            await createNegotiationHeldForApproval(
              provider,
              consumer,
              providerProtocolUrl,
              providerManagementUrl,
              apiToken,
            );

          await expect(
            provider.management.contractNegotiations.reject(
              providerNegotiationId,
            ),
          ).resolves.not.toThrow();

          await waitForNegotiationState(
            consumer,
            consumerNegotiationId,
            "TERMINATED",
          );
        });

        it("fails to reject a non-existent contract negotiation", async () => {
          const maybeNegotiation = negotiations.reject(crypto.randomUUID());

          await expect(maybeNegotiation).rejects.toThrow("resource not found");

          maybeNegotiation.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("delete", () => {
        it("deletes a terminated contract negotiation", async () => {
          // A negotiation can only be deleted once it is TERMINATED and has no
          // agreement. Initiating against an unknown offer makes the provider
          // reject the request, so the negotiation terminates without ever
          // producing an agreement.
          const { id } = await negotiations.initiate({
            counterPartyAddress: providerProtocolUrl,
            policy: new PolicyBuilder()
              .raw({
                "@id": crypto.randomUUID(),
                "@type": "Offer",
                assigner: "provider",
                target: crypto.randomUUID(),
              })
              .type("Offer")
              .build(),
          });

          await waitForNegotiationState(consumer, id, "TERMINATED");

          await expect(negotiations.delete(id)).resolves.not.toThrow();

          await expect(negotiations.get(id)).rejects.toThrow(
            "resource not found",
          );
        });

        it("fails to delete a non-existent contract negotiation", async () => {
          const maybeNegotiation = negotiations.delete(crypto.randomUUID());

          await expect(maybeNegotiation).rejects.toThrow("resource not found");

          maybeNegotiation.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("getAgreement", () => {
        it("returns the agreement for a target negotiation", async () => {
          const { assetId, idResponse } = await requestContractNegotiation(provider, consumer, providerProtocolUrl);

          const negotiationId = idResponse.id;

          await waitForNegotiationState(consumer, negotiationId, "FINALIZED");

          const contractAgreement =
            await negotiations.getAgreement(negotiationId);

          expect(contractAgreement).toHaveProperty("assetId", assetId);
        });
      });
    });
  };

  runContractNegotiationTests("v4", v4Consumer);
});
