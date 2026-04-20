import nock from "nock";
import { AssetInput, EdcConnectorClient, MANAGEMENT_V2_CONTEXT } from "../src";

describe("management api version", () => {
  const managementUrl = "http://management-api-version.test/management";
  const assetResponse = {
    "@id": "test-asset",
    "@type": "edc:Asset",
    "edc:properties": { "edc:id": "test-asset" },
    "edc:privateProperties": {},
    "edc:dataAddress": { "@type": "edc:DataAddress" },
  };
  const idResponse = {
    "@id": "new-asset",
    "@type": "edc:IdResponse",
    "edc:createdAt": 1234567890,
  };

  const buildClient = (managementApiVersion?: string) => {
    const builder = new EdcConnectorClient.Builder().managementUrl(
      managementUrl,
    );

    return managementApiVersion
      ? builder.managementApiVersion(managementApiVersion).build()
      : builder.build();
  };

  const expectManagementV2Context = (body: any) => {
    expect(body["@context"]).toEqual([MANAGEMENT_V2_CONTEXT]);
    return true;
  };

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  it("should use v3 path by default", async () => {
    const scope = nock(managementUrl)
      .get("/v3/assets/test-asset")
      .reply(200, assetResponse);

    const client = buildClient();

    await client.management.assets.get("test-asset");

    expect(scope.isDone()).toBe(true);
  });

  it("should use v4beta path when configured via builder", async () => {
    const scope = nock(managementUrl)
      .get("/v4beta/assets/test-asset")
      .reply(200, assetResponse);

    const client = buildClient("v4beta");

    await client.management.assets.get("test-asset");

    expect(scope.isDone()).toBe(true);
  });

  it("should use v4 path when configured via builder", async () => {
    const scope = nock(managementUrl)
      .get("/v4/assets/test-asset")
      .reply(200, assetResponse);

    const client = buildClient("v4");

    await client.management.assets.get("test-asset");

    expect(scope.isDone()).toBe(true);
  });

  it("should use v4beta path when configured via context override", async () => {
    const scope = nock(managementUrl)
      .get("/v4beta/assets/test-asset")
      .reply(200, assetResponse);

    const client = buildClient();

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
        .post("/v4beta/assets", (body) => {
          expect(body).toMatchObject({
            "@type": "Asset",
            properties: { name: "test" },
            dataAddress: { type: "HttpData" },
          });
          return expectManagementV2Context(body);
        })
        .reply(200, idResponse);

      const client = buildClient("v4beta");

      const assetInput: AssetInput = {
        "@type": "Asset",
        properties: { name: "test" },
        dataAddress: { type: "HttpData" },
      };

      await client.management.assets.create(assetInput);

      expect(scope.isDone()).toBe(true);
    });

    it("queryAll", async () => {
      const scope = nock(managementUrl)
        .post("/v4beta/assets/request", (body) => {
          expect(body).toMatchObject({ "@type": "QuerySpec" });
          return expectManagementV2Context(body);
        })
        .reply(200, []);

      const client = buildClient("v4beta");

      await client.management.assets.queryAll();

      expect(scope.isDone()).toBe(true);
    });

    it("delete", async () => {
      const scope = nock(managementUrl)
        .delete("/v4beta/assets/test-asset")
        .reply(204);

      const client = buildClient("v4beta");

      await client.management.assets.delete("test-asset");

      expect(scope.isDone()).toBe(true);
    });

    it("update", async () => {
      const scope = nock(managementUrl)
        .put("/v4beta/assets", (body) => {
          expect(body).toMatchObject({
            "@id": "test-asset",
            "@type": "Asset",
            properties: { name: "updated" },
            dataAddress: { type: "HttpData" },
          });
          return expectManagementV2Context(body);
        })
        .reply(204);

      const client = buildClient("v4beta");

      const updateInput: AssetInput = {
        "@id": "test-asset",
        "@type": "Asset",
        properties: { name: "updated" },
        dataAddress: { type: "HttpData" },
      };

      await client.management.assets.update(updateInput);

      expect(scope.isDone()).toBe(true);
    });

    it("uses the same management v2 context for stable v4", async () => {
      const scope = nock(managementUrl)
        .post("/v4/assets", (body) => {
          expect(body).toMatchObject({
            "@type": "Asset",
            properties: { name: "stable" },
          });
          return expectManagementV2Context(body);
        })
        .reply(200, idResponse);

      const client = buildClient("v4");

      await client.management.assets.create({
        "@type": "Asset",
        properties: { name: "stable" },
      });

      expect(scope.isDone()).toBe(true);
    });
  });
});
