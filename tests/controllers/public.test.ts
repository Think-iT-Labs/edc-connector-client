import { EdcConnectorClient } from "../../src";
import { createContractAgreement, waitForTransferState, waitFor } from "../test-utils";

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

  describe("edcClient.public.getTransferredData", () => {

    it("initiate the transfer process", async () => {
      const { assetId, contractAgreement } = await createContractAgreement(
        provider, consumer
      );

      const idResponse = await consumer.management.transferProcesses.initiate(
        {
          assetId,
          transferType: "HttpData-PULL",
          counterPartyAddress: provider.addresses.protocol!,
          contractId: contractAgreement.id
        },
      );

      await waitForTransferState(consumer, idResponse.id, "STARTED");

      const edr = await consumer.management.edrs.dataAddress(idResponse.id);

      const data = await provider.public.getTransferredData({
        ['Authorization']: edr.mandatoryValue('edc', 'authorization'),
      });

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
