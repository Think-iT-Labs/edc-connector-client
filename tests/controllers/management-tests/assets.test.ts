import * as crypto from "node:crypto";
import {
  AssetInput,
  EdcConnectorClient,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("AssetController", () => {
  const edcClient = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  const assets = edcClient.management.assets;

  describe("create", () => {
    it("succesfully creates an asset", async () => {
      const id = crypto.randomUUID()
      const assetInput: AssetInput = {
        "@id": id,
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        }
      };

      const idResponse = await assets.create(assetInput);

      expect(idResponse.id).toBe(id);
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("fails creating two assets with the same id", async () => {
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          name: "Test asset",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        }
      };

      await assets.create(assetInput);
      const maybeCreateResult = assets.create(assetInput);

      await expect(maybeCreateResult).rejects.toThrowError("duplicated resource");

      maybeCreateResult.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("delete", () => {
    it("deletes a target asset", async () => {
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          name: "Test asset",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        }
      };
      await assets.create(assetInput);

      const asset = await assets.delete(assetInput["@id"] as string);

      expect(asset).toBeUndefined();
    });

    it("fails to delete an not existent asset", async () => {
      const maybeAsset = assets.delete(crypto.randomUUID());

      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });

  });

  describe("get", () => {
    it("returns a target asset", async () => {
      const assetInput: AssetInput = {
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          name: "Test asset",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
        privateProperties: {
          privateKey: "private-value"
        }
      };
      const idResponse = await assets.create(assetInput);

      const asset = await assets.get(idResponse.id);

      expect(asset.id).toBe(idResponse.id)
      expect(asset.properties.mandatoryValue('edc', 'name'))
        .toBe("product description")
      expect(asset.privateProperties.mandatoryValue('edc', 'privateKey'))
        .toBe("private-value")
    });

    it("fails to fetch an not existent asset", async () => {
      const maybeAsset = assets.get(crypto.randomUUID());

      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("queryAll", () => {
    it("succesfully retuns a list of assets", async () => {
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          name: "Test asset",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
          type: "HttpData",
        }
      };
      await assets.create(assetInput);

      const result = await assets.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(
        result.find((asset) => asset.id === assetInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("update", () => {
    it("updates a target asset", async () => {
      const id = crypto.randomUUID();
      const assetInput = {
        "@id": id,
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          name: "test asset",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
        },
        privateProperties: {
          privateKey: "private-value"
        }
      };
      await assets.create(assetInput);

      const updateAssetInput = {
        "@id": assetInput["@id"],
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: { type: "s3" },
        privateProperties: { }
      };
      await assets.update(updateAssetInput);

      const updatedAsset = await assets.get(id);

      expect(updatedAsset.properties.mandatoryValue('edc', 'name'))
        .toBe("updated test asset");
      expect(updatedAsset.properties.mandatoryValue('edc', 'contenttype'))
        .toBe("text/plain");
      expect(updatedAsset.dataAddress.mandatoryValue('edc', 'type')).toBe("s3");
      expect(Object.keys(updatedAsset.privateProperties).length).toBe(0);
    });

    it("fails to update a not-existent asset", async () => {
      const updateAssetInput = {
        "@id": crypto.randomUUID(),
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: { type: "s3" }
      };

      const maybeUpdatedAsset = assets.update(updateAssetInput);

      await expect(maybeUpdatedAsset).rejects.toThrowError("resource not found");

      maybeUpdatedAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });
});
