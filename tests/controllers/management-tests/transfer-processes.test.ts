import {
  Addresses,
  EDC_NAMESPACE,
  EdcConnectorClient,
  TransferProcessStates,
} from "../../../src";
import {
  createContractAgreement,
  createReceiverServer,
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

  describe("edcClient.management.dataplanes.list", () => {
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

  describe("edcClient.management.transferProcesses.getState", () => {
    it("successfully gets a transfer process state", async () => {
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

      const idResponse = await edcClient.management.transferProcesses.initiate(
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
      const transferProcessState =
        await edcClient.management.transferProcesses.getState(
          consumerContext,
          idResponse["@id"],
        );

      // then
      expect(Object.values(TransferProcessStates)).toContain(
        transferProcessState[`${EDC_NAMESPACE}:state`],
      );
    });
  });
});
