import {
  AssetInput,
  DEFAULT_MANAGEMENT_API_VERSION,
  EdcConnectorClient,
} from "../../../src";
import { AssetController } from "../../../src/controllers";

describe("assets", () => {
  let v3Assets: AssetController;
  let v4Assets: AssetController;

  beforeAll(async () => {
    v3Assets = new EdcConnectorClient.Builder()
      .apiToken("123456")
      .managementUrl("http://localhost:19193/management")
      .managementApiVersion(DEFAULT_MANAGEMENT_API_VERSION)
      .build().management.assets;

    v4Assets = new EdcConnectorClient.Builder()
      .apiToken("123456")
      .managementUrl("http://localhost:19193/management")
      .managementApiVersion("v4")
      .build().management.assets;
  });

  describe("v3", () => {
    it("should create and get", async () => {
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

      const asset = await v3Assets.get(idResponse.id);

      expect(asset.id).not.toBeNull();
    });

    it("should delete asset", async () => {
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

      const result = await v3Assets.delete(idResponse.id);

      expect(result).toBeUndefined();
    });

    it("should query assets", async () => {
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

      await v3Assets.create(assetInput);
      const result = await v3Assets.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).not.toBeNull();
    });

    it("should update asset", async () => {
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

      const updateAssetInput: AssetInput = {
        "@id": idResponse.id,
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: { type: "any" },
        privateProperties: {},
      };

      const result = await v3Assets.update(updateAssetInput);

      expect(result).toBeUndefined();
    });
  });

  describe("v4", () => {
    it("should create and get", async () => {
      const assetInput: AssetInput = {
        "@type": "Asset",
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      };

      const idResponse = await v4Assets.create(assetInput);

      expect(idResponse.id).not.toBeNull();
      expect(idResponse.createdAt).toBeGreaterThan(0);

      const asset = await v4Assets.get(idResponse.id);

      expect(asset.id).not.toBeNull();
    });

    it("should delete asset", async () => {
      const assetInput: AssetInput = {
        "@type": "Asset",
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      };

      const idResponse = await v4Assets.create(assetInput);

      const result = await v4Assets.delete(idResponse.id);

      expect(result).toBeUndefined();
    });

    it("should query assets", async () => {
      const assetInput: AssetInput = {
        "@type": "Asset",
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      };

      await v4Assets.create(assetInput);
      const result = await v4Assets.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).not.toBeNull();
    });

    it("should update asset", async () => {
      const assetInput: AssetInput = {
        "@type": "Asset",
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
      };

      const idResponse = await v4Assets.create(assetInput);

      const updateAssetInput: AssetInput = {
        "@type": "Asset",
        "@id": idResponse.id,
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: { type: "any" },
        privateProperties: {},
      };

      const result = await v4Assets.update(updateAssetInput);

      expect(result).toBeUndefined();
    });
  });
});
