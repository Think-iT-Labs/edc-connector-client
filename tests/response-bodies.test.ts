import nock from "nock";
import {
  EDC_CONTEXT,
  EdcConnectorClient,
  JsonLdObject,
  MANAGEMENT_V2_CONTEXT,
  PolicyBuilder,
} from "../src";

describe("response bodies", () => {
  // a host no integration suite talks to: keep-alive connections they leave
  // open towards the real connectors would bypass nock
  const managementUrl = "http://connector.test/management";

  const client = new EdcConnectorClient.Builder()
    .managementUrl(managementUrl)
    .build();

  const agreement = {
    "@context": [MANAGEMENT_V2_CONTEXT],
    "@type": "ContractAgreement",
    "@id": "agreement-id",
    assetId: "asset-id",
    policy: {
      "@id": "policy-id",
      "@type": "Agreement",
      assignee: "consumer",
      assigner: "provider",
      target: "asset-id",
    },
    contractSigningDate: 1700000000,
    consumerId: "consumer",
    providerId: "provider",
  };

  const negotiation = {
    "@context": [MANAGEMENT_V2_CONTEXT],
    "@type": "ContractNegotiation",
    "@id": "negotiation-id",
    type: "CONSUMER",
    protocol: "dataspace-protocol-http:2025-1",
    profile: "dataspace-protocol-http:2025-1",
    state: "FINALIZED",
    counterPartyId: "provider",
    counterPartyAddress: "http://provider/api/dsp/2025-1",
    callbackAddresses: [
      {
        "@type": "CallbackAddress",
        transactional: false,
        uri: "http://callback",
        events: ["contract.negotiation"],
      },
    ],
    createdAt: 1700000000000,
    assetId: "asset-id",
    contractAgreementId: "agreement-id",
  };

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
    // no JSON-LD context is ever fetched to map a response body
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    nock.restore();
  });

  it("returns response bodies as they come from the connector", async () => {
    nock("http://connector.test")
      .get("/management/v4/contractagreements/agreement-id")
      .reply(200, agreement)
      .get("/management/v4/contractagreements/agreement-id/negotiation")
      .reply(200, negotiation);

    // getting an agreement before its negotiation used to drop most of the
    // negotiation properties, because of a jsonld context cache bug (#726)
    const actualAgreement =
      await client.management.contractAgreements.get("agreement-id");
    const actualNegotiation =
      await client.management.contractAgreements.getNegotiation(
        "agreement-id",
      );

    expect(actualAgreement).toStrictEqual(agreement);
    expect(actualNegotiation).toStrictEqual(negotiation);
    expect(actualNegotiation.state).toBe("FINALIZED");
    expect(actualNegotiation.counterPartyId).toBe("provider");
    expect(actualNegotiation.counterPartyAddress).toBe(
      "http://provider/api/dsp/2025-1",
    );
  });

  it("returns array response bodies as they come from the connector", async () => {
    nock("http://connector.test")
      .post("/management/v4/contractnegotiations/request")
      .reply(200, [negotiation]);

    const negotiations =
      await client.management.contractNegotiations.queryAll();

    expect(negotiations).toStrictEqual([negotiation]);
  });

  describe("legacy accessors", () => {
    const catalog = {
      "@context": [MANAGEMENT_V2_CONTEXT],
      "@id": "catalog-id",
      "@type": "Catalog",
      participantId: "provider",
      dataset: [
        {
          "@id": "asset-id",
          "@type": "Dataset",
          hasPolicy: [
            {
              "@id": "offer-id",
              "@type": "Offer",
              permission: [{ action: "use" }],
            },
          ],
        },
      ],
    };

    it("exposes the 0.11.x accessors without changing the body", async () => {
      nock("http://connector.test")
        .post("/management/v4/catalog/request")
        .reply(200, catalog);

      const actual = await client.management.catalog.request({
        counterPartyAddress: "http://provider",
        counterPartyId: "provider",
      });

      expect(actual.id).toBe("catalog-id");
      expect(actual.datasets).toHaveLength(1);
      const [dataset] = actual.datasets;
      expect(dataset.id).toBe("asset-id");
      const [offer] = dataset.offers;
      expect(offer.id).toBe("offer-id");
      expect(offer.permissions).toEqual([{ action: "use" }]);
      expect(offer.prohibitions).toEqual([]);
      expect(offer.obligations).toEqual([]);

      expect(actual).toStrictEqual(catalog);
      expect(JSON.parse(JSON.stringify(actual))).toStrictEqual(catalog);
      expect(Object.keys({ ...offer })).not.toContain("id");
    });

    it("returns an empty list of datasets for an empty catalog", async () => {
      nock("http://connector.test")
        .post("/management/v4/catalog/request")
        .reply(200, { "@id": "catalog-id", "@type": "Catalog" });

      const actual = await client.management.catalog.request({
        counterPartyAddress: "http://provider",
        counterPartyId: "provider",
      });

      expect(actual.datasets).toEqual([]);
    });

    it("exposes the policy rules on a built policy", () => {
      const policy = new PolicyBuilder()
        .type("Set")
        .raw({ permission: [{ action: "use" }] })
        .build();

      expect(policy.permissions).toEqual([{ action: "use" }]);
      expect(policy.obligations).toEqual([]);
    });
  });

  describe("expansion", () => {
    const contextUrl = "https://example.com/context.jsonld";
    const context = { "@context": { "@vocab": EDC_CONTEXT } };

    const expandingClient = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .cachedJsonLdContext(contextUrl, context)
      .build();

    it("expands a response body on demand", async () => {
      nock("http://connector.test")
        .get("/management/v4/contractnegotiations/negotiation-id")
        .reply(200, { ...negotiation, "@context": contextUrl });

      const body =
        await expandingClient.management.contractNegotiations.get(
          "negotiation-id",
        );
      const expanded = await expandingClient.expand(body);

      expect(expanded).toBeInstanceOf(JsonLdObject);
      expect(expanded["@id"]).toBe("negotiation-id");
      expect(expanded.mandatoryValue("edc", "state")).toBe("FINALIZED");
      expect(expanded.mandatoryValue("edc", "counterPartyId")).toBe(
        "provider",
      );
      expect(expanded.array("edc", "callbackAddresses")).toHaveLength(1);
    });

    it("expands an array response body on demand", async () => {
      nock("http://connector.test")
        .post("/management/v4/contractnegotiations/request")
        .reply(200, [
          { ...negotiation, "@context": contextUrl },
          { ...negotiation, "@id": "other-id", "@context": contextUrl },
        ]);

      const body =
        await expandingClient.management.contractNegotiations.queryAll();
      const expanded = await expandingClient.expandArray(body);

      expect(expanded.map((it) => it["@id"])).toEqual([
        "negotiation-id",
        "other-id",
      ]);
      expect(expanded[1].mandatoryValue("edc", "state")).toBe("FINALIZED");
    });

    it("expands into a custom instance", async () => {
      class State extends JsonLdObject {
        get state(): string {
          return this.mandatoryValue("edc", "state");
        }
      }

      const expanded = await expandingClient.expand(
        { "@context": contextUrl, state: "FINALIZED" },
        () => new State(),
      );

      expect(expanded).toBeInstanceOf(State);
      expect(expanded.state).toBe("FINALIZED");
    });
  });
});
