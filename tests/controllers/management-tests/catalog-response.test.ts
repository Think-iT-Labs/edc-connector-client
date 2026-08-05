import nock = require("nock");
import { EdcConnectorClient } from "../../../src";

const catalogResponse = {
  "@id": "catalog",
  "@type": "Catalog",
  dataset: [
    {
      "@id": "asset",
      "@type": "Dataset",
      hasPolicy: [
        {
          "@id": "offer",
          "@type": "Offer",
        },
      ],
    },
  ],
  participantId: "did:web:identityhub.example:user:participant-a-01",
  "@context": [
    "https://w3id.org/tractusx/auth/v1.0.0",
    "https://w3id.org/dspace/2025/1/context.jsonld",
    "https://w3id.org/edc/dspace/v0.0.1",
    {
      "fx-policy": "https://w3id.org/factoryx/policy/v1.0/",
    },
  ],
};

describe("CatalogController catalog response compatibility", () => {
  const managementUrl = "http://connector.example/management";

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  it("parses catalogs containing the Tractus-X authentication context", async () => {
    const request = nock(managementUrl)
      .post("/v3/catalog/request")
      .reply(200, catalogResponse);

    const client = new EdcConnectorClient.Builder()
      .apiToken("test-token")
      .managementUrl(managementUrl)
      .build();

    const catalog = await client.management.catalog.request({
      counterPartyAddress: "https://provider.example/api/v1/dsp/2025-1",
      counterPartyId: "did:web:provider.example",
    });

    expect(catalog.participantId).toBe(
      "did:web:identityhub.example:user:participant-a-01",
    );
    expect(catalog.datasets[0].id).toBe("asset");
    expect(catalog.datasets[0].offers[0].id).toBe("offer");
    expect(request.isDone()).toBe(true);
  });
});
