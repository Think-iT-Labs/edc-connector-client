import {
  EdcConnectorClient,
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../src";
import { createContractAgreement, createReceiverServer } from "../test-utils";

describe("PublicController", () => {
  const consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .publicUrl("http://localhost:29291/public")
    .protocolUrl("http://provider-connector:9194/protocol")
    .build();

  const receiverServer = createReceiverServer();

  beforeAll(async () => {
    await receiverServer.listen();
  });

  afterAll(async () => {
    await receiverServer.shutdown();
  });

  describe("edcClient.public.getTransferredData", () => {
    it("fails to return an object in response", async () => {
      // when
      const maybeData = provider.public.getTransferredData({});

      // then
      await expect(maybeData).rejects.toThrowError("request was malformed");

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
      const dataplaneInput = {
        id: "provider-dataplane",
        url: "http://provider-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://provider-connector:9291/public/",
        },
      };

      await provider.management.dataplanes.register(dataplaneInput);

      const { assetId, contractAgreement } = await createContractAgreement(
        provider, consumer
      );

      const idResponse = await consumer.management.transferProcesses.initiate(
        {
          assetId,
          connectorId: "provider",
          connectorAddress: provider.addresses.protocol!,
          contractId: contractAgreement.id,
          dataDestination: { type: "HttpProxy" },
        },
      );

      const transferProcessResponse = await receiverServer.waitForEvent(
        idResponse.id,
      );

      // when
      const data = await provider.public.getTransferredData({
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
            d.push(...data.value);
          }
        }
        resolve(JSON.parse(Buffer.from(d).toString()));
      });

      expect(transferredData.length).toBeGreaterThan(0);
    });
  });
});
