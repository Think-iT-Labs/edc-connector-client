import { EDC_CONTEXT } from "../../src/entities/context";
import { JsonLdService, TransferProcess } from "../../src";

const vocabContext = { "@context": { "@vocab": EDC_CONTEXT } };

describe("TransferProcess", () => {
  const service = new JsonLdService();

  it("parses the full transfer process body", async () => {
    const transferProcess = await service.expand(
      {
        ...vocabContext,
        "@id": "transfer-id",
        "@type": "TransferProcess",
        correlationId: "correlation-id",
        type: "CONSUMER",
        state: "STARTED",
        stateTimestamp: 1700000000000,
        assetId: "asset-id",
        contractId: "contract-id",
        transferType: "HttpData-PULL",
        errorDetail: "something went wrong",
        callbackAddresses: [
          {
            uri: "http://callback/one",
            events: ["transfer.process.started"],
          },
          {
            uri: "http://callback/two",
            events: ["transfer.process.completed"],
          },
        ],
      },
      () => new TransferProcess(),
    );

    expect(transferProcess.id).toBe("transfer-id");
    expect(transferProcess.correlationId).toBe("correlation-id");
    expect(transferProcess.type).toBe("CONSUMER");
    expect(transferProcess.state).toBe("STARTED");
    expect(transferProcess.stateTimestamp).toBe(1700000000000);
    expect(transferProcess.assetId).toBe("asset-id");
    expect(transferProcess.contractId).toBe("contract-id");
    expect(transferProcess.transferType).toBe("HttpData-PULL");
    expect(transferProcess.errorDetail).toBe("something went wrong");
    expect(transferProcess.callbackAddresses).toHaveLength(2);
  });

  it("leaves optional fields undefined when absent", async () => {
    const transferProcess = await service.expand(
      {
        ...vocabContext,
        "@id": "transfer-id",
        "@type": "TransferProcess",
        state: "REQUESTED",
      },
      () => new TransferProcess(),
    );

    expect(transferProcess.transferType).toBeUndefined();
    expect(transferProcess.errorDetail).toBeUndefined();
    expect(transferProcess.callbackAddresses).toEqual([]);
    expect(transferProcess.dataplaneMetadata).toBeUndefined();
  });
});
