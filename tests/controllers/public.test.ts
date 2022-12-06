import { Addresses, EdcClient } from "../../src";
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
    it("initiate the transfer process", async () => {
      // given
      const edcClient = new EdcClient();
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
      const rs = await new Promise<Uint8Array>(async (resolve) => {
        let done = false;
        let d: number[] = [];
        do {
          const data = await reader.read();
          done = data.done;
          if (data.value) {
            d.push(...data.value);
          }
        } while (done);
        resolve(new Uint8Array(d));
      });

      const transferredData = JSON.parse(Buffer.from(rs).toString());

      // then
      expect(transferredData.length).toBeGreaterThan(0);
    });
  });
});
