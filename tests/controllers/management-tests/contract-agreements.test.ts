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

  describe("edcClient.management.contractAgreements.queryAll", () => {
    it("retrieves all contract agreements", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        idResponse.id,
        "FINALIZED",
      );
      const contractNegotiation =
        await edcClient.management.contractNegotiations.get(
          consumerContext,
          idResponse.id,
        );

      // when
      const contractAgreements =
        await edcClient.management.contractAgreements.queryAll(consumerContext);

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

  describe("edcClient.management.getAgreement", () => {
    it("retrieves target contract agreement", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);

      // when
      const { contractNegotiation, contractAgreement } =
        await createContractAgreement(
          edcClient,
          providerContext,
          consumerContext,
        );

      // then
      expect(contractAgreement).toHaveProperty(
        "id",
        contractNegotiation.contractAgreementId,
      );
    });

    it("fails to fetch an not existent contract negotiation", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.contractAgreements.get(
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
});
