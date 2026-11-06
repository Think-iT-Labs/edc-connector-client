import { EDC_CONTEXT } from "../../src/entities/context";
import { ContractNegotiation, JsonLdService } from "../../src";

const vocabContext = { "@context": { "@vocab": EDC_CONTEXT } };

describe("ContractNegotiation", () => {
  const service = new JsonLdService();

  it("parses the full V4 contract negotiation body", async () => {
    const negotiation = await service.expand(
      {
        ...vocabContext,
        "@id": "negotiation-id",
        "@type": "ContractNegotiation",
        type: "CONSUMER",
        protocol: "dataspace-protocol-http:2025-1",
        profile: "a-profile",
        counterPartyAddress: "http://provider/protocol",
        counterPartyId: "provider",
        state: "FINALIZED",
        createdAt: 1700000000000,
        contractAgreementId: "agreement-id",
        errorDetail: "something went wrong",
        callbackAddresses: [
          {
            uri: "http://callback/one",
            events: ["contract.negotiation.finalized"],
          },
        ],
      },
      () => new ContractNegotiation(),
    );

    expect(negotiation.id).toBe("negotiation-id");
    expect(negotiation.type).toBe("CONSUMER");
    expect(negotiation.protocol).toBe("dataspace-protocol-http:2025-1");
    expect(negotiation.profile).toBe("a-profile");
    expect(negotiation.counterPartyAddress).toBe("http://provider/protocol");
    expect(negotiation.counterPartyId).toBe("provider");
    expect(negotiation.state).toBe("FINALIZED");
    expect(negotiation.createdAt).toBe(1700000000000);
    expect(negotiation.contractAgreementId).toBe("agreement-id");
    expect(negotiation.errorDetail).toBe("something went wrong");
    expect(negotiation.callbackAddresses).toHaveLength(1);
  });

  it("leaves optional fields undefined when absent", async () => {
    const negotiation = await service.expand(
      {
        ...vocabContext,
        "@id": "negotiation-id",
        "@type": "ContractNegotiation",
        type: "PROVIDER",
        state: "REQUESTED",
      },
      () => new ContractNegotiation(),
    );

    expect(negotiation.protocol).toBeUndefined();
    expect(negotiation.profile).toBeUndefined();
    expect(negotiation.counterPartyAddress).toBeUndefined();
    expect(negotiation.counterPartyId).toBeUndefined();
    expect(negotiation.createdAt).toBeUndefined();
    expect(negotiation.errorDetail).toBeUndefined();
    expect(negotiation.contractAgreementId).toBeUndefined();
    expect(negotiation.callbackAddresses).toEqual([]);
  });
});
