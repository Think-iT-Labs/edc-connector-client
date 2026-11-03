import * as crypto from "node:crypto";
import { EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src";
import {
  createContractAgreement,
  createContractNegotiation,
  waitForNegotiationState,
} from "../../test-utils";

describe("ContractAgreementController", () => {

  const providerProtocolUrl = "http://provider-connector:9194/protocol/2025-1";

  const v4Consumer = new EdcConnectorClient.Builder()
    .authorization("X-Api-Key", "123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .authorization("X-Api-Key", "123456")
    .managementUrl("http://localhost:29193/management")
    .build();

  const runContractAgreementTests = (
    label: string,
    consumer: EdcConnectorClient,
  ): void => {
    describe(label, () => {
      const contractAgreements = consumer.management.contractAgreements;

      describe("queryAll", () => {
        it("retrieves all contract agreements", async () => {
          const { idResponse } = await createContractNegotiation(
            provider,
            consumer,
            providerProtocolUrl,
          );
          await waitForNegotiationState(consumer, idResponse.id, "FINALIZED");
          const negotiation =
            await consumer.management.contractNegotiations.get(idResponse.id);

          const result = await contractAgreements.queryAll();

          expect(result.length).toBeGreaterThan(0);
          expect(result.find(a => a.id === negotiation.contractAgreementId))
            .toBeTruthy();
        });
      });

      describe("getAgreement", () => {
        it("retrieves target contract agreement", async () => {
          const { contractNegotiation, contractAgreement } =
            await createContractAgreement(provider, consumer, providerProtocolUrl);

          expect(contractAgreement.id).toBe(contractNegotiation.contractAgreementId);
        });

        it("fails to fetch an not existent contract agreement", async () => {
          const maybeAsset = contractAgreements.get(crypto.randomUUID());

          await expect(maybeAsset).rejects.toThrow("resource not found");

          maybeAsset.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("getNegotiation", () => {
        it("retrieves negotiation from agreement", async () => {
          const { contractAgreement, contractNegotiation } =
            await createContractAgreement(provider, consumer, providerProtocolUrl);

          const negotiation = await contractAgreements.getNegotiation(contractAgreement.id);

          expect(negotiation.id).toBe(contractNegotiation.id);
        });
      });

      describe("retire", () => {
        it("retires a contract agreement", async () => {
          const { contractAgreement } = await createContractAgreement(
            provider,
            consumer,
            providerProtocolUrl,
          );

          await expect(
            contractAgreements.retire(
              contractAgreement.id,
              "a reason to retire",
            ),
          ).resolves.not.toThrow();
        });

        it("fails to retire a non-existent contract agreement", async () => {
          const maybeRetire = contractAgreements.retire(
            crypto.randomUUID(),
            "a reason to retire",
          );

          await expect(maybeRetire).rejects.toThrow("resource not found");

          maybeRetire.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("unretire", () => {
        it("un-retires a previously retired contract agreement", async () => {
          const { contractAgreement } = await createContractAgreement(
            provider,
            consumer,
            providerProtocolUrl,
          );

          await contractAgreements.retire(
            contractAgreement.id,
            "a reason to retire",
          );

          await expect(
            contractAgreements.unretire(contractAgreement.id),
          ).resolves.not.toThrow();
        });

        it("fails to un-retire a non-existent contract agreement", async () => {
          const maybeUnretire = contractAgreements.unretire(crypto.randomUUID());

          await expect(maybeUnretire).rejects.toThrow("resource not found");

          maybeUnretire.catch((error) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });
    });
  };

  runContractAgreementTests("v4", v4Consumer);
});
