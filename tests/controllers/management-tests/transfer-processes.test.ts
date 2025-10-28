import {
  EdcConnectorClient,
  IdResponse,
  TransferProcessStates,
} from "../../../src";
import { createContractAgreement, waitForTransferState } from "../../test-utils";

describe("TransferProcessController", () => {
  const consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .protocolUrl("http://consumer-connector:9194/protocol/2025-1")
    .build();

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol/2025-1")
    .build();


  describe("queryAll", () => {
    it("retrieves all tranfer processes", async () => {
      const idResponse = await initiate();
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
      const idResponse = await initiate();
      await waitForTransferState(consumer, idResponse.id, "STARTED");

      const transferProcess =
        await consumer.management.transferProcesses.get(idResponse.id);

      expect(transferProcess.id).toEqual(idResponse.id);
    });
  });

  describe("getState", () => {
    it("successfully gets a transfer process state", async () => {
      const idResponse = await initiate();

      const transferProcessState =
        await consumer.management.transferProcesses.getState(idResponse.id);

      expect(Object.values(TransferProcessStates)).toContain(
        transferProcessState.state,
      );
    });
  });

  describe("terminate", () => {
    it("successfully terminates a transfer process", async () => {
      const idResponse = await initiate();
      await waitForTransferState(consumer, idResponse.id, "STARTED");

      await consumer.management.transferProcesses.terminate(idResponse.id, "a reason");

      await waitForTransferState(consumer, idResponse.id, "TERMINATED");
    });
  });

  describe("deprovision", () => {
    it("successfully deprovision a transfer process", async () => {
      const idResponse = await initiate();
      await waitForTransferState(consumer, idResponse.id, "STARTED");

      await consumer.management.transferProcesses.terminate(idResponse.id, "a reason");
      await waitForTransferState(consumer, idResponse.id, "TERMINATED");

      await consumer.management.transferProcesses.deprovision(idResponse.id);

      await waitForTransferState(consumer, idResponse.id, "DEPROVISIONED");
    });
  });

  async function initiate(): Promise<IdResponse> {
    const { contractAgreement } = await createContractAgreement(
      provider, consumer);

    return await consumer.management.transferProcesses.initiate(
      {
        counterPartyAddress: provider.addresses.protocol!,
        contractId: contractAgreement.id,
        transferType: "HttpData-PULL"
      },
    );
  }

});
