import {
  DEFAULT_MANAGEMENT_API_VERSION,
  EdcConnectorClient,
  IdResponse,
  TransferProcessStates,
} from "../../../src";
import { createContractAgreement, waitForTransferState } from "../../test-utils";

describe("TransferProcessController", () => {
  const v3Consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion(DEFAULT_MANAGEMENT_API_VERSION)
    .protocolUrl("http://consumer-connector:9194/protocol/2025-1")
    .build();

  const v4Consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .protocolUrl("http://consumer-connector:9194/protocol/2025-1")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol/2025-1")
    .build();

  const runTransferProcessTests = (
    label: string,
    consumer: EdcConnectorClient,
  ): void => {
    describe(label, () => {
      describe("queryAll", () => {
        it("retrieves all transfer processes", async () => {
          const idResponse = await initiate(consumer);
          await waitForTransferState(consumer, idResponse.id, "STARTED");

          const transferProcesses =
            await consumer.management.transferProcesses.queryAll();

          expect(transferProcesses.length).toBeGreaterThan(0);
          expect(
            transferProcesses.find(
              (transferProcess) => idResponse.id === transferProcess.id,
            ),
          ).toBeTruthy();
        });
      });

      describe("get", () => {
        it("successfully gets a transfer process", async () => {
          const idResponse = await initiate(consumer);
          await waitForTransferState(consumer, idResponse.id, "STARTED");

          const transferProcess =
            await consumer.management.transferProcesses.get(idResponse.id);

          expect(transferProcess.id).toEqual(idResponse.id);
        });
      });

      describe("getState", () => {
        it("successfully gets a transfer process state", async () => {
          const idResponse = await initiate(consumer);

          const transferProcessState =
            await consumer.management.transferProcesses.getState(idResponse.id);

          expect(Object.values(TransferProcessStates)).toContain(
            transferProcessState.state,
          );
        });
      });

      describe("terminate", () => {
        it("successfully terminates a transfer process", async () => {
          const idResponse = await initiate(consumer);
          await waitForTransferState(consumer, idResponse.id, "STARTED");

          await consumer.management.transferProcesses.terminate(idResponse.id, "a reason");

          await waitForTransferState(consumer, idResponse.id, "TERMINATED");
        });
      });
    });
  };

  async function initiate(consumer: EdcConnectorClient): Promise<IdResponse> {
    const { contractAgreement } = await createContractAgreement(
      provider, consumer);

    return await consumer.management.transferProcesses.initiate(
      {
        counterPartyAddress: provider.addresses.protocol!,
        counterPartyId: "provider",
        contractId: contractAgreement.id,
        transferType: "HttpData-PULL"
      },
    );
  }

  runTransferProcessTests("v3", v3Consumer);
  runTransferProcessTests("v4", v4Consumer);
});
