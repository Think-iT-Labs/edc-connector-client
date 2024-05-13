import { GenericContainer, StartedTestContainer } from "testcontainers";
import { AssetInput, EdcConnectorClient } from "../../../src";
import { AssetController } from "../../../src/controllers";

describe("AssetController", () => {
  let startedContainer: StartedTestContainer;
  let assets: AssetController;

  beforeAll(async () => {
    startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
      .withCopyFilesToContainer([{ source: "node_modules/management-api.yml", target: "/management-api.yml" }])
      .withCommand(["mock", "-h", "0.0.0.0", "/management-api.yml"])
      .withExposedPorts(4010)
      .start();

      assets = new EdcConnectorClient.Builder()
        .managementUrl("http://localhost:" + startedContainer.getFirstMappedPort())
        .build()
        .management.assets;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should create asset", async () => {
    const assetInput: AssetInput = {
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

    expect(idResponse.id).not.toBeNull();
    expect(idResponse.createdAt).toBeGreaterThan(0);
  });

  it("should delete asset", async () => {
    const result = await assets.delete("assetId");

    expect(result).toBeUndefined();
  });

  it("should get asset", async () => {
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
    const updateAssetInput = {
      "@id": "id",
      properties: { name: "updated test asset", contenttype: "text/plain" },
      dataAddress: { type: "any" },
      privateProperties: { }
    };

    const result = await assets.update(updateAssetInput);

    expect(result).toBeUndefined();
  });

});
