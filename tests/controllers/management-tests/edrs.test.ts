import { StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import {
  startPrismContainer,
  stopPrismContainer,
} from "../../prism-container";

describe("edrs", () => {
  let startedContainer: StartedTestContainer | undefined;
  let edcClient: EdcConnectorClient;

  beforeAll(async () => {
    startedContainer = await startPrismContainer(
      "node_modules/management-api.yml",
      "/management-api.yml",
    );

      edcClient = new EdcConnectorClient.Builder()
        .managementUrl("http://localhost:" + startedContainer.getFirstMappedPort())
        .build();
  });

  afterAll(async () => {
    await stopPrismContainer(startedContainer);
  });

  it("should request edrs", async () => {
    const result = await edcClient.management.edrs.request();

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].transferProcessId).not.toBeNull();
    expect(result[0].contractNegotiationId).not.toBeNull();
    expect(result[0].assetId).not.toBeNull();
    expect(result[0].providerId).not.toBeNull();
    expect(result[0].agreementId).not.toBeNull();
  })

  it("should delete edrs", async () => {
    await expect(edcClient.management.edrs.delete("edrId")).resolves
      .not.toThrow();
  });

  it("should get data address", async () => {
    const dataAddress = await edcClient.management.edrs.dataAddress("edrId");

    expect(dataAddress.types().length).toBeGreaterThan(0);
  });

});
