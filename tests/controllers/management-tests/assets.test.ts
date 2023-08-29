import * as crypto from "node:crypto";
import {
  AssetInput,
  EDC_NAMESPACE,
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
      // given
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };

      // when
      const idResponse = await assets.create(assetInput);

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
    });

    it("fails creating two assets with the same id", async () => {
      // given
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };

      // when
      await assets.create(assetInput);
      const maybeCreateResult = assets.create(assetInput);

      // then
      await expect(maybeCreateResult).rejects.toThrowError(
        "duplicated resource",
      );

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
      // given
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await assets.create(assetInput);

      // when
      const asset = await assets.delete(assetInput["@id"] as string);

      // then
      expect(asset).toBeUndefined();
    });

    it("fails to delete an not existant asset", async () => {
      // when
      const maybeAsset = assets.delete(crypto.randomUUID());

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });

    it.todo("fails to delete an asset that is part of an agreed contract");
  });

  describe("get", () => {
    it("returns a target asset", async () => {
      // given
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await assets.create(assetInput);

      // when
      const asset = await assets.get(assetInput["@id"] as string);

      // then
      expect(asset).toHaveProperty("@context");
      expect(asset).toHaveProperty("@id", assetInput["@id"]);
    });

    it("fails to fetch an not existant asset", async () => {
      // when
      const maybeAsset = assets.get(crypto.randomUUID());

      // then
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
      // given
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
        },
      };
      await assets.create(assetInput);

      // when
      const result = await assets.queryAll();

      // then
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.find((asset) => asset?.["@id"] === assetInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("update", () => {
    it("updates a target asset", async () => {
      // given
      const assetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await assets.create(assetInput);
      const updateAssetInput = {
        "@id": assetInput["@id"],
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: {
          type: "s3",
        },
      };

      // when
      await assets.update(updateAssetInput);

      const updatedAsset = await assets.get(
        assetInput["@id"],
      );

      // then
      expect(updatedAsset).toHaveProperty("@type");
      expect(updatedAsset).toEqual(
        expect.objectContaining({
          [`${EDC_NAMESPACE}:properties`]: {
            [`${EDC_NAMESPACE}:name`]: updateAssetInput.properties.name,
            [`${EDC_NAMESPACE}:id`]: updateAssetInput["@id"],
            [`${EDC_NAMESPACE}:contenttype`]:
              updateAssetInput.properties.contenttype,
          },
          [`${EDC_NAMESPACE}:dataAddress`]: {
            [`${EDC_NAMESPACE}:type`]: updateAssetInput.dataAddress.type,
            "@type": "edc:DataAddress",
          },
        }),
      );
    });

    it("fails to update an inexistant asset", async () => {
      // given
      const updateAssetInput = {
        "@id": crypto.randomUUID(),
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: {
          type: "s3",
        },
      };

      // when
      const maybeUpdatedAsset = assets.update(
        updateAssetInput,
      );

      // then
      await expect(maybeUpdatedAsset).rejects.toThrowError(
        "resource not found",
      );

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
