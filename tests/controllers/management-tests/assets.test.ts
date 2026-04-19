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
  let assets: AssetController;

  beforeAll(async () => {
    startedContainer = await startPrismContainer(
      "node_modules/management-api.yml",
      "/management-api.yml",
    );

    assets = new EdcConnectorClient.Builder()
      .managementUrl(
        "http://localhost:" + startedContainer.getFirstMappedPort(),
      )
      .managementApiVersion(DEFAULT_MANAGEMENT_API_VERSION)
      .build().management.assets;
  });

  afterAll(async () => {
    await stopPrismContainer(startedContainer);
  });

  it("should create asset", async () => {
    let assetInput: AssetInput = {
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
  });

  it("should query assets", async () => {
    const result = await assets.queryAll();

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).not.toBeNull();
  });

  it("should update asset", async () => {
    let updateAssetInput: AssetInput = {
      "@id": "id",
      "@type": "Asset",
      properties: { name: "updated test asset", contenttype: "text/plain" },
      dataAddress: { type: "any" },
      privateProperties: {},
    };

    const result = await assets.update(updateAssetInput);

    expect(result).toBeUndefined();
  });
});
