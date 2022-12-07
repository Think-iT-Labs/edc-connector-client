import {
  Addresses,
  EdcConnectorClient,
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../src";
import { createContractAgreement, createReceiverServer } from "../test-utils";

jest.setTimeout(30000);

describe("PublicController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191",
    validation: "http://localhost:19192",
    data: "http://localhost:19193",
    ids: "http://consumer-connector:9194",
    dataplane: "http://localhost:19195",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };
  const provider: Addresses = {
    default: "http://localhost:29191",
    validation: "http://localhost:29192",
    data: "http://localhost:29193",
    ids: "http://provider-connector:9194",
    dataplane: "http://localhost:29195",
    public: "http://localhost:29291",
    control: "http://localhost:29292",
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
      const { assetId, contractAgreement } = await createContractAgreement(
        edcClient,
        providerContext,
        consumerContext,
      );

      const receiverCallback = receiverServer.waitForEvent(
        contractAgreement.id,
      );

      await edcClient.data.initiateTransfer(
        consumerContext,
        {
          assetId,
          "connectorId": "provider",
          "connectorAddress": `${providerContext.ids}/api/v1/ids/data`,
          "contractId": contractAgreement.id,
          "managedResources": false,
          "dataDestination": { "type": "HttpProxy" },
        },
      );

      const transferProcessResponse = await receiverCallback;

      // when
      const data = await edcClient.public.getTranferedData(consumerContext, {
        [transferProcessResponse.authKey]: transferProcessResponse.authCode,
      });

      const reader = data.getReader();
      const transferredData = await new Promise<any>(async (resolve) => {
        const d: number[] = [];
        while (true) {
          const data = await reader.read();
          if (data.done) {
            break;
          }

          if (data.value) {
            d.push(...data.value);
          }
        }
        resolve(JSON.parse(Buffer.from(d).toString()));
      });

      // then
      expect(transferredData.length).toBeGreaterThan(0);
    });
  });
});
