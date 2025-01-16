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

describe("ContractNegotiationController", () => {
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

  const negotiations = consumer.management.contractNegotiations;

  describe("initiate", () => {

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
      const contractNegotiations = await negotiations.queryAll();

      // then
      expect(contractNegotiations.length).toBeGreaterThan(0);
      expect(
        contractNegotiations.find(
          (contractNegotiation) => contractNegotiation.id === idResponse.id,
        ),
      ).toBeTruthy();
    });

    it("filters negotiations on the provider side based on agreements' assed ID", async () => {
      // given
      const { assetId } = await createContractAgreement(provider, consumer);

      // when
      const [providerNegotiation] =
        await negotiations.queryAll(
          {
            filterExpression: [
              {
                operandLeft: "contractAgreement.assetId",
                operator: "=",
                operandRight: assetId,
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
      const contractNegotiation = await negotiations.get(idResponse.id);

      // then
      expect(contractNegotiation.id).toEqual(idResponse.id);
    });

    it("fails to fetch an not existant contract negotiation", async () => {
      // when
      const maybeNegotiation = negotiations.get(crypto.randomUUID(),);

      // then
      await expect(maybeNegotiation).rejects.toThrowError("resource not found");

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
      // given
      const { idResponse } = await createContractNegotiation(provider, consumer);

      // when
      const contractNegotiationState = await negotiations.getState(idResponse.id);

      // then
      expect(contractNegotiationState).toHaveProperty("state");
    });

    it("fails to fetch an not existant contract negotiation's state", async () => {
      // when
      const maybeNegotiation = negotiations.getState(crypto.randomUUID(),);

      // then
      await expect(maybeNegotiation).rejects.toThrowError("resource not found");

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

    it("terminate the requested target negotiation", async () => {
      const { idResponse } = await createContractNegotiation(provider, consumer);
      const negotiationId = idResponse.id;
      await waitForNegotiationState(consumer, negotiationId, "FINALIZED");

      await negotiations.terminate(negotiationId, "a reason to terminate");

      await waitForNegotiationState(consumer, negotiationId, "TERMINATED");

      const negotiationState = await negotiations.getState(negotiationId);

      expect(negotiationState.state).toBe("TERMINATED");
    });

    it("fails to terminate an not existent contract negotiation", async () => {
      const maybeNegotiation = negotiations.terminate(
        crypto.randomUUID(),
        "a reason to terminate",
      );

      await expect(maybeNegotiation).rejects.toThrowError("resource not found");

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
      const contractAgreement = await negotiations.getAgreement(negotiationId);

      // then
      expect(contractAgreement).toHaveProperty("assetId", assetId);
    });
  });
});
