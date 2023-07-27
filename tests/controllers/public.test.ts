import {
  Addresses,
  EdcConnectorClient,
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../src";
import { createContractAgreement, createReceiverServer } from "../test-utils";

describe("PublicController", () => {
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

  const receiverServer = createReceiverServer();

  beforeAll(async () => {
    await receiverServer.listen();
  });

  afterAll(async () => {
    await receiverServer.shutdown();
  });

  describe("edcClient.public.getTranferedData", () => {
    it("fails to return an object in response", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeData = edcClient.public.getTranferedData(context, {});

      // then
      await expect(maybeData).rejects.toThrowError(
        "request was malformed",
      );

      maybeData.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.BadRequest,
        );
      });
    });

    it("initiate the transfer process", async () => {
      // given
      const edcClient = new EdcConnectorClient();

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

      await edcClient.management.registerDataplane(
        providerContext,
        dataplaneInput,
      );

      const { assetId, contractAgreement } = await createContractAgreement(
        edcClient,
        providerContext,
        consumerContext,
      );

      const receiverCallback = receiverServer.waitForEvent('endpoint-data-reference');

      await edcClient.management.initiateTransfer(
        consumerContext,
        {
          assetId,
          "connectorId": "provider",
          "connectorAddress": providerContext.protocol,
          "contractId": contractAgreement.id,
          "managedResources": false,
          "dataDestination": { "type": "HttpProxy" }
        },
      );

      const transferProcessResponse = await receiverCallback;

      // when
      const data = await edcClient.public.getTranferedData(consumerContext, {
        [transferProcessResponse.authKey]: transferProcessResponse.authCode,
      });

      // then
      expect(data.body).toBeTruthy();

      const reader = data.body!.getReader();
      const transferredData = await new Promise<any>(async (resolve) => {
        const d: number[] = [];
        while (true) {
          const data = await reader.read();
          if (data.done) {
            break;
          }

          if (data.value) {
            d.push(... data.value);
          }
        }
        resolve(JSON.parse(Buffer.from(d).toString()));
      });

      expect(transferredData.length).toBeGreaterThan(0);
    });
  });
});
