import { GenericContainer, StartedTestContainer } from "testcontainers";
import { SecretBuilder, EdcConnectorClient } from "../../../src";
import { SecretController } from "../../../src/controllers";

describe("secrets", () => {
  let startedContainer: StartedTestContainer;
  let secrets: SecretController;

  beforeAll(async () => {
    startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
      .withCopyFilesToContainer([{ source: "node_modules/management-api.yml", target: "/management-api.yml" }])
      .withCommand(["mock", "-h", "0.0.0.0", "/management-api.yml"])
      .withExposedPorts(4010)
      .start();

      secrets = new EdcConnectorClient.Builder()
        .managementUrl("http://localhost:" + startedContainer.getFirstMappedPort())
        .build()
        .management.secrets;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should create secret", async () => {
    const secret = new SecretBuilder()
      .id("secretId")
      .value("secretValue")
      .build();

    const idResponse = await secrets.create(secret);

    expect(idResponse.id).not.toBeNull();
    expect(idResponse.createdAt).toBeGreaterThan(0);
  });

  it("should get secret", async () => {
    const secret = await secrets.get("secretId");

    expect(secret.id).not.toBeNull();
    expect(secret.value).not.toBeNull();
  });

  it("should delete secret", async () => {
    const result = await secrets.delete("secretId");

    expect(result).toBeUndefined();
  });


  it("should update secret", async () => {
    const secret = new SecretBuilder()
      .id("secretId")
      .value("updatedSecretValue")
      .build();

    const result = await secrets.update(secret);

    expect(result).toBeUndefined();
  });

});
