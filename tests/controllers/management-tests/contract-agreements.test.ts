import * as crypto from "node:crypto";
import {
  EdcConnectorClient,
  MANAGEMENT_API_VERSIONS,
  ManagementApiVersion,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  waitForNegotiationState,
} from "../../test-utils";

describe.each<ManagementApiVersion>(MANAGEMENT_API_VERSIONS)(
  "ContractAgreementController (%s)",
  (apiVersion) => {
    const consumer = new EdcConnectorClient.Builder()
      .apiToken("123456")
      .managementUrl("http://localhost:19193/management")
      .protocolUrl("http://consumer-connector:9194/protocol/2025-1")
      .managementApiVersion(apiVersion)
      .build();

    const provider = new EdcConnectorClient.Builder()
      .apiToken("123456")
      .managementUrl("http://localhost:29193/management")
      .protocolUrl("http://provider-connector:9194/protocol/2025-1")
      .managementApiVersion(apiVersion)
      .build();

    const contractAgreements = consumer.management.contractAgreements;

    describe("queryAll", () => {
      it("retrieves all contract agreements", async () => {
        const { idResponse } = await createContractNegotiation(
          apiVersion,
          provider,
          consumer,
        );
        await waitForNegotiationState(consumer, idResponse.id, "FINALIZED");
        const negotiation = await consumer.management.contractNegotiations.get(
          idResponse.id,
        );

        const result = await contractAgreements.queryAll();

        expect(result.length).toBeGreaterThan(0);
        expect(
          result.find((a) => a.id === negotiation.contractAgreementId),
        ).toBeTruthy();
      });
    });

    describe("getAgreement", () => {
      it("retrieves target contract agreement", async () => {
        const { contractNegotiation, contractAgreement } =
          await createContractAgreement(apiVersion, provider, consumer);

        expect(contractAgreement.id).toBe(
          contractNegotiation.contractAgreementId,
        );
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
          await createContractAgreement(apiVersion, provider, consumer);

        const negotiation = await contractAgreements.getNegotiation(
          contractAgreement.id,
        );

        expect(negotiation.id).toBe(contractNegotiation.id);
      });
    });
  },
);
