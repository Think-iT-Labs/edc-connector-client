import * as crypto from "node:crypto";
import { Addresses, AssetInput, EdcClient } from "../../src";
import { EdcClientError, EdcClientErrorType } from "../../src/error";

describe("DataController", () => {
  const apiToken = "123456";
  const addresses: Addresses = {
    default: "http://localhost:19191",
    validation: "http://localhost:19192",
    data: "http://localhost:19193",
    ids: "http://localhost:19194",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };

  describe("edcClient.data.createAsset", () => {
    it("succesfully creates an asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };

      // when
      const createResult = await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // then
      expect(createResult).toHaveProperty("createdAt");
      expect(createResult).toHaveProperty("id");
    });

    it("fails creating two assets with the same id", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };

      // when
      await edcClient.data.createAsset(
        context,
        assetInput,
      );
      const maybeCreateResult = edcClient.data.createAsset(
        context,
        assetInput,
      );

      // then
      await expect(maybeCreateResult).rejects
        .toThrowError(
          "duplicated resource",
        );

      maybeCreateResult.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.deleteAsset", () => {
    it("deletes a target asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // when
      const asset = await edcClient.data.deleteAsset(
        context,
        assetInput.asset.properties["asset:prop:id"],
      );

      // then
      expect(asset).toBeUndefined();
    });

    it("fails to delete an not existant asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const maybeAsset = edcClient.data.deleteAsset(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });

    it.todo("fails to delete an asset that is part of an agreed contract");
  });

  describe("edcClient.data.getAsset", () => {
    it("returns a target asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // when
      const asset = await edcClient.data.getAsset(
        context,
        assetInput.asset.properties["asset:prop:id"],
      );

      // then
      expect(asset).toHaveProperty("createdAt");
      expect(asset).toHaveProperty(
        "id",
        assetInput.asset.properties["asset:prop:id"],
      );
    });

    it("fails to fetch an not existant asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const maybeAsset = edcClient.data.getAsset(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.listAssets", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // when
      const assets = await edcClient.data.listAssets(
        context,
      );

      // then
      expect(assets.length).toBeGreaterThan(0);
      expect(
        assets.find((asset) =>
          asset.properties["asset:prop:id"] ===
            assetInput.asset.properties["asset:prop:id"]
        ),
      ).toBeTruthy();
    });
  });
});
