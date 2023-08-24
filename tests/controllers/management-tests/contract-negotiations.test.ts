import * as crypto from "node:crypto";
import { EdcConnectorClientBuilder } from "../../../src";
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
  const consumer = new EdcConnectorClientBuilder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .protocolUrl("http://consumer-connector:9194/protocol")
    .build();

  const provider = new EdcConnectorClientBuilder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol")
    .build();

  describe("inititate", () => {
    /**
    TODO
    Automated "decline" test case
    - provider creates asset, ...
    - when consumer starts needs to specify the whole policy
    - if consumer changes the policy (e.g. remove permission)
      - provider will decline
    */

    it("kickstart a contract negotiation", async () => {
      // when
      const { idResponse } = await createContractNegotiation(provider, consumer);

      // then
      expect(idResponse).toHaveProperty("id");
      expect(idResponse).toHaveProperty("createdAt");
    });
  });

  describe("queryAll", () => {
    it("retrieves all contract negotiations", async () => {
      // given
      const { idResponse } = await createContractNegotiation(provider, consumer);

      // when
      const contractNegotiations =
        await consumer.management.contractNegotiations.queryAll();

      // then
      expect(contractNegotiations.length).toBeGreaterThan(0);
      expect(
        contractNegotiations.find(
          (contractNegotiation) => contractNegotiation["@id"] === idResponse.id,
        ),
      ).toBeTruthy();
    });

    it("filters negotiations on the provider side based on agreements' assed ID", async () => {
      // given
      const { assetId } = await createContractAgreement(provider, consumer);

      // when
      const [providerNegotiation] =
        await consumer.management.contractNegotiations.queryAll(
          {
            filterExpression: [
              {
                operandLeft: "contractAgreement.assetId",
                operandRight: assetId,
                operator: "=",
              },
            ],
          },
        );

      // then
      expect(providerNegotiation).toBeTruthy();
    });
  });

  describe("get", () => {
    it("retrieves target contract negotiation", async () => {
      // given
      const { idResponse } = await createContractNegotiation(provider, consumer);

      // when
      const contractNegotiation =
        await consumer.management.contractNegotiations.get(idResponse.id);

      // then
      expect(contractNegotiation).toHaveProperty("@id", idResponse.id);
    });

    it("fails to fetch an not existant contract negotiation", async () => {
      // when
      const maybeAsset = consumer.management.contractNegotiations.get(
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

  describe("getState", () => {
    it("returns the state of a target negotiation", async () => {
      // given
      const { idResponse } = await createContractNegotiation(provider, consumer);

      // when
      const contractNegotiationState =
        await consumer.management.contractNegotiations.getState(idResponse.id);

      // then
      expect(contractNegotiationState).toHaveProperty("state");
    });

    it("fails to fetch an not existant contract negotiation's state", async () => {
      // when
      const maybeAsset = consumer.management.contractNegotiations.getState(
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

  describe("terminate", () => {
    it("terminate the requested target negotiation", async () => {
      // given
      const { idResponse } = await createContractNegotiation(provider, consumer);

      const negotiationId = idResponse.id;

      // when
      const cancelledNegotiation =
        await consumer.management.contractNegotiations.terminate(
          negotiationId,
          "a reason to terminate",
        );
      await waitForNegotiationState(
        consumer,
        negotiationId,
        "TERMINATED",
      );

      const negotiationState =
        await consumer.management.contractNegotiations.getState(
          negotiationId,
        );

      // then
      expect(cancelledNegotiation).toBeUndefined();
      expect(negotiationState.state).toBe("TERMINATED");
    });

    it("fails to cancel an not existent contract negotiation", async () => {
      // when
      const maybeAsset = consumer.management.contractNegotiations.terminate(
        crypto.randomUUID(),
        "a reason to terminate",
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

  describe("getAgreement", () => {
    it("returns the a agreement for a target negotiation", async () => {
      // given
      const { assetId, idResponse } = await createContractNegotiation(provider, consumer);

      const negotiationId = idResponse.id;

      await waitForNegotiationState(
        consumer,
        negotiationId,
        "FINALIZED",
      );

      // when
      const contractAgreement =
        await consumer.management.contractNegotiations.getAgreement(
          negotiationId,
        );

      // then
      expect(contractAgreement).toHaveProperty("assetId", assetId);
    });
  });
});
