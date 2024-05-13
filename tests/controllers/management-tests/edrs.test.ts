import { GenericContainer, StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";

describe("EdrController", () => {
  let startedContainer: StartedTestContainer;
  let edcClient: EdcConnectorClient;

  beforeAll(async () => {
    startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
      .withCopyFilesToContainer([{ source: "node_modules/management-api.yml", target: "/management-api.yml" }])
      .withCommand(["mock", "-h", "0.0.0.0", "/management-api.yml"])
      .withExposedPorts(4010)
      .start();

      edcClient = new EdcConnectorClient.Builder()
        .managementUrl("http://localhost:" + startedContainer.getFirstMappedPort())
        .build();
  });

  afterAll(async () => {
    await startedContainer.stop();
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
      .not.toThrowError();
  });

  it("should get data address", async () => {
    const dataAddress = await edcClient.management.edrs.dataAddress("edrId");

    expect(dataAddress.types().length).toBeGreaterThan(0);
  });

});
