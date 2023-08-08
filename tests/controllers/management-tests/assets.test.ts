import * as crypto from "node:crypto";
import { Addresses, AssetInput, EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("AssetController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191/api",
    management: "http://localhost:19193/management",
    protocol: "http://consumer-connector:9194/protocol",
    public: "http://localhost:19291/public",
    control: "http://localhost:19292/control",
  };

  const edcClient = new EdcConnectorClient();

  describe("edcClient.management.assets.create", () => {
    it("succesfully creates an asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          "@id": crypto.randomUUID(),
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };

      // when
      const idResponse = await edcClient.management.assets.create(
        context,
        assetInput,
      );

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
    });

    it("fails creating two assets with the same id", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          "@id": crypto.randomUUID(),
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
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
      await edcClient.management.assets.create(context, assetInput);
      const maybeCreateResult = edcClient.management.assets.create(
        context,
        assetInput,
      );

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

  describe("edcClient.management.delete", () => {
    it("deletes a target asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          "@id": crypto.randomUUID(),
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await edcClient.management.assets.create(context, assetInput);

      // when
      const asset = await edcClient.management.assets.delete(
        context,
        assetInput.asset["@id"] as string,
      );

      // then
      expect(asset).toBeUndefined();
    });

    it("fails to delete an not existant asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.assets.delete(
        context,
        crypto.randomUUID(),
      );

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

  describe("edcClient.management.assets.get", () => {
    it("returns a target asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          "@id": crypto.randomUUID(),
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await edcClient.management.assets.create(context, assetInput);

      // when
      const asset = await edcClient.management.assets.get(
        context,
        assetInput.asset["@id"] as string,
      );

      // then
      expect(asset).toHaveProperty("@context");
      expect(asset).toHaveProperty("@id", assetInput.asset["@id"]);
    });

    it("fails to fetch an not existant asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.assets.get(
        context,
        crypto.randomUUID(),
      );

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

  describe("edcClient.management.assets.queryAll", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          "@id": crypto.randomUUID(),
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
        },
        dataAddress: {
          name: "Test asset",
          baseUrl: "https://jsonplaceholder.typicode.com/users",
          type: "HttpData",
        },
      };
      await edcClient.management.assets.create(context, assetInput);

      // when
      const assets = await edcClient.management.assets.queryAll(context);

      // then
      expect(assets.length).toBeGreaterThan(0);
      expect(
        assets.find((asset) => asset?.["@id"] === assetInput.asset?.["@id"]),
      ).toBeTruthy();
    });
  });
});
