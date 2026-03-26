import nock from "nock";
import { AssetInput, EdcConnectorClient } from "../src";

describe("management api version", () => {
  const managementUrl = "http://localhost:19193/management";

  afterEach(() => {
    nock.cleanAll();
  });

  it("should use v3 path by default", async () => {
    const scope = nock(managementUrl)
      .get("/v3/assets/test-asset")
      .reply(200, {
        "@id": "test-asset",
        "@type": "edc:Asset",
        "edc:properties": { "edc:id": "test-asset" },
        "edc:privateProperties": {},
        "edc:dataAddress": { "@type": "edc:DataAddress" },
      });

    const client = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .build();

    await client.management.assets.get("test-asset");

    expect(scope.isDone()).toBe(true);
  });

  it("should use v4beta path when configured via builder", async () => {
    const scope = nock(managementUrl)
      .get("/v4beta/assets/test-asset")
      .reply(200, {
        "@id": "test-asset",
        "@type": "edc:Asset",
        "edc:properties": { "edc:id": "test-asset" },
        "edc:privateProperties": {},
        "edc:dataAddress": { "@type": "edc:DataAddress" },
      });

    const client = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .managementApiVersion("v4beta")
      .build();

    await client.management.assets.get("test-asset");

    expect(scope.isDone()).toBe(true);
  });

  it("should use v4beta path when configured via context override", async () => {
    const scope = nock(managementUrl)
      .get("/v4beta/assets/test-asset")
      .reply(200, {
        "@id": "test-asset",
        "@type": "edc:Asset",
        "edc:properties": { "edc:id": "test-asset" },
        "edc:privateProperties": {},
        "edc:dataAddress": { "@type": "edc:DataAddress" },
      });

    const client = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .build();

    const v4Context = EdcConnectorClient.createContext({
      addresses: { management: managementUrl },
      managementApiVersion: "v4beta",
    });

    await client.management.assets.get("test-asset", v4Context);

    expect(scope.isDone()).toBe(true);
  });

  describe("should use correct version path for all asset operations", () => {
    it("create", async () => {
      const scope = nock(managementUrl)
        .post("/v4beta/assets")
        .reply(200, {
          "@id": "new-asset",
          "@type": "edc:IdResponse",
          "edc:createdAt": 1234567890,
        });

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .managementApiVersion("v4beta")
        .build();

      const assetInput: AssetInput = {
        properties: { name: "test" },
        dataAddress: { type: "HttpData" },
      };

      await client.management.assets.create(assetInput);

      expect(scope.isDone()).toBe(true);
    });

    it("queryAll", async () => {
      const scope = nock(managementUrl)
        .post("/v4beta/assets/request")
        .reply(200, []);

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .managementApiVersion("v4beta")
        .build();

      await client.management.assets.queryAll();

      expect(scope.isDone()).toBe(true);
    });

    it("delete", async () => {
      const scope = nock(managementUrl)
        .delete("/v4beta/assets/test-asset")
        .reply(204);

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .managementApiVersion("v4beta")
        .build();

      await client.management.assets.delete("test-asset");

      expect(scope.isDone()).toBe(true);
    });

    it("update", async () => {
      const scope = nock(managementUrl).put("/v4beta/assets").reply(204);

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .managementApiVersion("v4beta")
        .build();

      const updateInput = {
        "@id": "test-asset",
        properties: { name: "updated" },
        dataAddress: { type: "HttpData" },
      };

      await client.management.assets.update(updateInput);

      expect(scope.isDone()).toBe(true);
    });
  });
});
