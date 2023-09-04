import {
  EDC_NAMESPACE,
  EdcConnectorClient,
  TransferProcessStates,
} from "../../../src";
import {
  createContractAgreement,
  createReceiverServer,
} from "../../test-utils";

describe("TransferProcessController", () => {
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

  describe("with receiver server", () => {
    const receiverServer = createReceiverServer();

    beforeAll(async () => {
      await receiverServer.listen();
    });

    afterAll(async () => {
      await receiverServer.shutdown();
    });

    describe("queryAll", () => {
      it("retrieves all tranfer processes", async () => {
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
          provider, consumer);

        const idResponse =
          await consumer.management.transferProcesses.initiate(
            {
              assetId,
              connectorId: "provider",
              connectorAddress: provider.addresses.protocol!,
              contractId: contractAgreement.id,
              managedResources: false,
              dataDestination: { type: "HttpProxy" },
            },
          );

        // when
        const transferProcesses =
          await consumer.management.transferProcesses.queryAll();

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

  describe("getState", () => {
    it("successfully gets a transfer process state", async () => {
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

      await provider.management.dataplanes.register(
        dataplaneInput,
      );

      const { assetId, contractAgreement } = await createContractAgreement(
        provider, consumer);

      const idResponse = await consumer.management.transferProcesses.initiate(
        {
          assetId,
          connectorId: "provider",
          connectorAddress: provider.addresses.protocol!,
          contractId: contractAgreement.id,
          managedResources: false,
          dataDestination: { type: "HttpProxy" },
        },
      );

      // when
      const transferProcessState =
        await consumer.management.transferProcesses.getState(
          idResponse["@id"],
        );

      // then
      expect(Object.values(TransferProcessStates)).toContain(
        transferProcessState[`${EDC_NAMESPACE}:state`],
      );
    });
  });

});
