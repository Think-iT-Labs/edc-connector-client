import * as crypto from "node:crypto";
import { DEFAULT_MANAGEMENT_API_VERSION, EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  waitForNegotiationState,
} from "../../test-utils";

describe("ContractNegotiationController", () => {
  const v3Consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion(DEFAULT_MANAGEMENT_API_VERSION)
    .protocolUrl("http://consumer-connector:9194/protocol/2025-1")
    .build();

  const v4Consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .protocolUrl("http://consumer-connector:9194/protocol/2025-1")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol/2025-1")
    .build();

  const runContractNegotiationTests = (
    label: string,
    consumer: EdcConnectorClient,
  ): void => {
    describe(label, () => {
      const negotiations = consumer.management.contractNegotiations;

      describe("initiate", () => {
        it("kickstart a contract negotiation", async () => {
          const { idResponse } = await createContractNegotiation(
            provider,
            consumer,
          );

          expect(idResponse).toHaveProperty("id");
          expect(idResponse).toHaveProperty("createdAt");
        });
      });

      describe("queryAll", () => {
        it("retrieves all contract negotiations", async () => {
          const { idResponse } = await createContractNegotiation(
            provider,
            consumer,
          );

          const contractNegotiations = await negotiations.queryAll();

          expect(contractNegotiations.length).toBeGreaterThan(0);
          expect(
            contractNegotiations.find(
              (contractNegotiation) => contractNegotiation.id === idResponse.id,
            ),
          ).toBeTruthy();
        });

        it("filters negotiations based on agreements' asset ID", async () => {
          const { assetId } = await createContractAgreement(provider, consumer);

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
          const { idResponse } = await createContractNegotiation(
            provider,
            consumer,
          );

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
          const { idResponse } = await createContractNegotiation(
            provider,
            consumer,
          );

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

      describe("getAgreement", () => {
        it("returns the agreement for a target negotiation", async () => {
          const { assetId, idResponse } = await createContractNegotiation(
            provider,
            consumer,
          );

          const negotiationId = idResponse.id;

          await waitForNegotiationState(consumer, negotiationId, "FINALIZED");

          const contractAgreement =
            await negotiations.getAgreement(negotiationId);

          expect(contractAgreement).toHaveProperty("assetId", assetId);
        });
      });
    });
  };

  runContractNegotiationTests("v3", v3Consumer);
  runContractNegotiationTests("v4", v4Consumer);
});
