import * as crypto from "node:crypto";
import { EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  waitForNegotiationState,
} from "../../test-utils";

describe("ContractAgreementController", () => {

  const consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .protocolUrl("http://consumer-connector:9194/protocol")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol")
    .build();

  describe("queryAll", () => {
    it("retrieves all contract agreements", async () => {
      // given
      const { idResponse } = await createContractNegotiation(provider, consumer);
      await waitForNegotiationState(consumer, idResponse.id, "FINALIZED");
      const contractNegotiation =
        await consumer.management.contractNegotiations.get(idResponse.id,);

      // when
      const contractAgreements =
        await consumer.management.contractAgreements.queryAll();

      // then
      expect(contractAgreements.length).toBeGreaterThan(0);
      expect(
        contractAgreements.find(
          (agreement) =>
            agreement.id === contractNegotiation.contractAgreementId,
        ),
      ).toBeTruthy();
    });
  });

  describe("getAgreement", () => {
    it("retrieves target contract agreement", async () => {
      // when
      const { contractNegotiation, contractAgreement } =
        await createContractAgreement(provider, consumer);

      // then
      expect(contractAgreement).toHaveProperty(
        "id",
        contractNegotiation.contractAgreementId,
      );
    });

    it("fails to fetch an not existent contract negotiation", async () => {
      // when
      const maybeAsset = consumer.management.contractAgreements.get(
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });
});
