import { StartedTestContainer } from "testcontainers";
import {
  AssetInput,
  DEFAULT_MANAGEMENT_API_VERSION,
  EdcConnectorClient,
} from "../../../src";
import { AssetController } from "../../../src/controllers";
import {
  startPrismContainer,
  stopPrismContainer,
} from "../../prism-container";

describe("assets", () => {
  let startedContainer: StartedTestContainer | undefined;
  let v3Assets: AssetController;
  let v4betaAssets: AssetController;

  beforeAll(async () => {
    startedContainer = await startPrismContainer(
      "node_modules/management-api.yml",
      "/management-api.yml",
    );

    const managementUrl =
      "http://localhost:" + startedContainer.getFirstMappedPort();

    v3Assets = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .managementApiVersion(DEFAULT_MANAGEMENT_API_VERSION)
      .build().management.assets;

    v4betaAssets = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .managementApiVersion("v4beta")
      .build().management.assets;
  });

  afterAll(async () => {
    await stopPrismContainer(startedContainer);
  });

  describe("v3", () => {
    it("should create asset", async () => {
      const assetInput: AssetInput = {
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      };

      const idResponse = await v3Assets.create(assetInput);

      expect(idResponse.id).not.toBeNull();
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("should delete asset", async () => {
      const result = await v3Assets.delete("assetId");

      expect(result).toBeUndefined();
    });

    it("should get asset", async () => {
      const asset = await v3Assets.get("assetId");

      expect(asset.id).not.toBeNull();
    });

    it("should query assets", async () => {
      const result = await v3Assets.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).not.toBeNull();
    });

    it("should update asset", async () => {
      const updateAssetInput: AssetInput = {
        "@id": "id",
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: { type: "any" },
        privateProperties: {},
      };

      const result = await v3Assets.update(updateAssetInput);

      expect(result).toBeUndefined();
    });
  });

  describe("v4beta", () => {
    it("should create asset", async () => {
      const assetInput: AssetInput = {
        "@type": "Asset",
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          "@type": "DataAddress",
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      };

      const idResponse = await v4betaAssets.create(assetInput);

      expect(idResponse.id).not.toBeNull();
    });

    it("should delete asset", async () => {
      const result = await v4betaAssets.delete("assetId");

      expect(result).toBeUndefined();
    });

    it("should get asset", async () => {
      const asset = await v4betaAssets.get("assetId");

      expect(asset.id).not.toBeNull();
    });

    it("should query assets", async () => {
      const result = await v4betaAssets.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).not.toBeNull();
    });

    it("should update asset", async () => {
      const updateAssetInput: AssetInput = {
        "@id": "id",
        "@type": "Asset",
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: { "@type": "DataAddress", type: "HttpData" },
        privateProperties: {},
      };

      const result = await v4betaAssets.update(updateAssetInput);

      expect(result).toBeUndefined();
    });
  });
});
