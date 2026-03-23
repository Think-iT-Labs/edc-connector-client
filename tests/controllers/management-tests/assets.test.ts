import { GenericContainer, StartedTestContainer } from "testcontainers";
import {
  AssetInput,
  AssetInputV3,
  AssetInputV4,
  EdcConnectorClient,
  MANAGEMENT_API_VERSIONS,
  ManagementApiVersion,
} from "../../../src";
import { AssetController } from "../../../src/controllers";

describe.each<ManagementApiVersion>(MANAGEMENT_API_VERSIONS)(
  "assets (%s)",
  (apiVersion) => {
    const itIfV4 = apiVersion === "v4beta" ? it.skip : it; // TODO: remove when specs are fixed

    let startedContainer: StartedTestContainer;
    let assets: AssetController;

    beforeAll(async () => {
      startedContainer = await new GenericContainer("stoplight/prism:5.14.2")
        .withCopyFilesToContainer([
          {
            source: "node_modules/management-api.yml",
            target: "/management-api.yml",
          },
        ])
        .withCommand(["mock", "-h", "0.0.0.0", "/management-api.yml"])
        .withExposedPorts(4010)
        .start();

      assets = new EdcConnectorClient.Builder()
        .managementUrl(
          "http://localhost:" + startedContainer.getFirstMappedPort(),
        )
        .managementApiVersion(apiVersion)
        .build().management.assets;
    });

    afterAll(async () => {
      await startedContainer.stop();
    });

    itIfV4("should create asset", async () => {
      let assetInput: AssetInput;
      if (apiVersion === "v3") {
        assetInput = {
          version: "v3",
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
          dataAddress: {
            type: "HttpData",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        } satisfies AssetInputV3;
      } else {
        assetInput = {
          version: "v4",
          "@type": "Asset",
          "@id": "@id",
          dataplaneMetadata: {
            "@type": "@type",
            properties: {
              type: "HttpData",
              baseUrl: "https://jsonplaceholder.typicode.com/users",
            },
            labels: ["labels"],
          },
          privateProperties: {},
          "@context": {},
          properties: {
            name: "product description",
            contenttype: "application/json",
          },
        } satisfies AssetInputV4;
      }

      const idResponse = await assets.create(assetInput);

      expect(idResponse.id).not.toBeNull();
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("should delete asset", async () => {
      const result = await assets.delete("assetId");

      expect(result).toBeUndefined();
    });

    itIfV4("should get asset", async () => {
      const asset = await assets.get("assetId");

      expect(asset.id).not.toBeNull();
      expect(Object.keys(asset.properties).length).toBeGreaterThan(0);
      expect(Object.keys(asset.privateProperties).length).toBeGreaterThan(0);
    });

    it("should query assets", async () => {
      const result = await assets.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).not.toBeNull();
    });

    it("should update asset", async () => {
      let updateAssetInput: AssetInput;
      if (apiVersion === "v3") {
        updateAssetInput = {
          version: "v3",
          "@id": "id",
          properties: { name: "updated test asset", contenttype: "text/plain" },
          dataAddress: { type: "any" },
          privateProperties: {},
        } satisfies AssetInputV3;
      } else {
        updateAssetInput = {
          version: "v4",
          "@type": "Asset",
          dataplaneMetadata: {
            "@type": "@type",
            properties: {
              key: "value",
            },
            labels: ["labels", "labels"],
          },
          "@id": "@id",
          privateProperties: {},
          "@context": {},
          properties: { name: "updated test asset", contenttype: "text/plain" },
        } satisfies AssetInputV4;
      }

      const result = await assets.update(updateAssetInput);

      expect(result).toBeUndefined();
    });
  },
);
