import * as crypto from "node:crypto";
import { Addresses, EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  waitForNegotiationState,
} from "../../test-utils";

describe("ManagementController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191/api",
    management: "http://localhost:19193/management",
    protocol: "http://consumer-connector:9194/protocol",
    public: "http://localhost:19291/public",
    control: "http://localhost:19292/control",
  };
  const provider: Addresses = {
    default: "http://localhost:29191/api",
    management: "http://localhost:29193/management",
    protocol: "http://provider-connector:9194/protocol",
    public: "http://localhost:29291/public",
    control: "http://localhost:29292/control",
  };

  const edcClient = new EdcConnectorClient();

  describe("edcClient.management.initiateContractNegotiation", () => {
    /**
    TODO
    Automated "decline" test case
    - provider creates asset, ...
    - when consumer starts needs to specify the whole policy
    - if consumer changes the policy (e.g. remove permission)
      - provider will decline
    */

    it("kickstart a contract negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);

      // when
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // then
      expect(idResponse).toHaveProperty("id");
      expect(idResponse).toHaveProperty("createdAt");
    });
  });

  describe("edcClient.management.contractNegotiations.queryAll", () => {
    it("retrieves all contract negotiations", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const contractNegotiations =
        await edcClient.management.contractNegotiations.queryAll(
          consumerContext,
        );

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
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId } = await createContractAgreement(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const [providerNegotiation] =
        await edcClient.management.contractNegotiations.queryAll(
          providerContext,
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

  describe("edcClient.management.contractNegotiations.get", () => {
    it("retrieves target contract negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const contractNegotiation =
        await edcClient.management.contractNegotiations.get(
          consumerContext,
          idResponse.id,
        );

      // then
      expect(contractNegotiation).toHaveProperty("@id", idResponse.id);
    });

    it("fails to fetch an not existant contract negotiation", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.contractNegotiations.get(
        context,
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

  describe("edcClient.management.contractNegotiations.getState", () => {
    it("returns the state of a target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const contractNegotiationState =
        await edcClient.management.contractNegotiations.getState(
          consumerContext,
          idResponse.id,
        );

      // then
      expect(contractNegotiationState).toHaveProperty("state");
    });

    it("fails to fetch an not existant contract negotiation's state", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.contractNegotiations.getState(
        context,
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

  describe("edcClient.management.contractNegotiations.cancel", () => {
    it.skip("cancel the requested target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      const negotiationId = idResponse.id;

      // when
      const cancelledNegotiation =
        await edcClient.management.contractNegotiations.cancel(
          consumerContext,
          negotiationId,
        );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "TERMINATED",
      );

      const negotiationState =
        await edcClient.management.contractNegotiations.getState(
          consumerContext,
          negotiationId,
        );

      // then
      expect(cancelledNegotiation).toBeUndefined();
      expect(negotiationState.state).toBe("TERMINATED");
    });

    it.skip("fails to cancel an not existant contract negotiation", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.contractNegotiations.cancel(
        context,
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

  describe.skip("edcClient.management.contractNegotiations.decline", () => {
    it.skip("declines the a requested target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId, idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      const negotiationId = idResponse.id;

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "FINALIZED",
      );

      const providerNegotiation =
        await edcClient.management.contractNegotiations.queryAll(
          providerContext,
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

      // when
      await edcClient.management.contractNegotiations.decline(
        providerContext,
        providerNegotiation[0].contractAgreementId,
      );

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "TERMINATING",
      );

      const negotiationState =
        await edcClient.management.contractNegotiations.getState(
          consumerContext,
          negotiationId,
        );

      // then
      expect(negotiationState.state).toBe("TERMINATING");
    });
  });

  describe("edcClient.management.contractNegotiations.getAgreement", () => {
    it("returns the a agreement for a target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId, idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      const negotiationId = idResponse.id;

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "FINALIZED",
      );

      // when
      const contractAgreement =
        await edcClient.management.contractNegotiations.getAgreement(
          consumerContext,
          negotiationId,
        );

      // then
      expect(contractAgreement).toHaveProperty("assetId", assetId);
    });
  });
});
