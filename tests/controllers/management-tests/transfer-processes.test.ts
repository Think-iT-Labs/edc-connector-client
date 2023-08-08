import * as crypto from "node:crypto";
import { Addresses, EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  createReceiverServer,
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

  describe("with receiver server", () => {
    const receiverServer = createReceiverServer();

    beforeAll(async () => {
      await receiverServer.listen();
    });

    afterAll(async () => {
      await receiverServer.shutdown();
    });

    describe("edcClient.management.transferProcesses.queryAll", () => {
      it("retrieves all tranfer processes", async () => {
        // given
        const consumerContext = edcClient.createContext(apiToken, consumer);
        const providerContext = edcClient.createContext(apiToken, provider);
        const dataplaneInput = {
          id: "provider-dataplane",
          url: "http://provider-connector:9192/control/transfer",
          allowedSourceTypes: ["HttpData"],
          allowedDestTypes: ["HttpProxy", "HttpData"],
          properties: {
            publicApiUrl: "http://provider-connector:9291/public/",
          },
        };

        await edcClient.management.dataplanes.register(
          providerContext,
          dataplaneInput,
        );

        const { assetId, contractAgreement } = await createContractAgreement(
          edcClient,
          providerContext,
          consumerContext,
        );

        const idResponse =
          await edcClient.management.transferProcesses.initiate(
            consumerContext,
            {
              assetId,
              connectorId: "provider",
              connectorAddress: providerContext.protocol,
              contractId: contractAgreement.id,
              managedResources: false,
              dataDestination: { type: "HttpProxy" },
            },
          );

        // when
        const transferProcesses =
          await edcClient.management.transferProcesses.queryAll(
            consumerContext,
          );

        // then
        expect(transferProcesses.length).toBeGreaterThan(0);
        expect(
          transferProcesses.find(
            (transferProcess) => idResponse.id === transferProcess.id,
          ),
        ).toBeTruthy();
      });
    });
  });

  describe("edcClient.management.dataplanes.register", () => {
    it("succesfully register a dataplane", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const dataplaneInput = {
        id: "consumer-dataplane",
        url: "http://consumer-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://consumer-connector:9291/public/",
        },
      };

      // when
      const registration = await edcClient.management.dataplanes.register(
        context,
        dataplaneInput,
      );

      // then
      expect(registration).toBeUndefined();
    });
  });

  describe("edcClient.management.listDataplanes", () => {
    it("succesfully list available dataplanes", async () => {
      const context = edcClient.createContext(apiToken, consumer);
      const input = {
        url: "http://consumer-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://consumer-connector:9291/public/",
        },
      };
      await edcClient.management.dataplanes.register(context, input);

      const dataplanes = await edcClient.management.dataplanes.list(context);

      expect(dataplanes.length).toBeGreaterThan(0);
      dataplanes.forEach((dataplane) => {
        expect(dataplane).toHaveProperty("id");
        expect(dataplane).toHaveProperty("url", input.url);
        expect(dataplane).toHaveProperty(
          "allowedDestTypes",
          input.allowedDestTypes,
        );
        expect(dataplane).toHaveProperty(
          "allowedSourceTypes",
          input.allowedSourceTypes,
        );
        expect(dataplane.properties).toHaveProperty(
          "edc:publicApiUrl",
          "http://consumer-connector:9291/public/",
        );
      });
    });
  });
});
