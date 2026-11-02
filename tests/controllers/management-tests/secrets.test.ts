import { EdcConnectorClient, SecretBuilder } from "../../../src";

describe("secrets", () => {
  const secrets = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build().management.secrets;

  it("should create secret", async () => {
    const secret = new SecretBuilder()
      .id("secret-create")
      .value("secretValue")
      .build();

    const idResponse = await secrets.create(secret);

    expect(idResponse.id).toBe("secret-create");
    expect(idResponse.createdAt).toBeGreaterThan(0);
  });

  it("should get secret", async () => {
    await secrets.create(
      new SecretBuilder().id("secret-get").value("secretValue").build(),
    );

    const secret = await secrets.get("secret-get");

    expect(secret.id).toBe("secret-get");
    expect(secret.value).toBe("secretValue");
  });

  it("should delete secret", async () => {
    await secrets.create(
      new SecretBuilder().id("secret-delete").value("secretValue").build(),
    );

    const result = await secrets.delete("secret-delete");

    expect(result).toBeUndefined();
  });

  it("should update secret", async () => {
    await secrets.create(
      new SecretBuilder().id("secret-update").value("secretValue").build(),
    );

    const result = await secrets.update(
      new SecretBuilder().id("secret-update").value("updatedSecretValue").build(),
    );

    expect(result).toBeUndefined();

    const updated = await secrets.get("secret-update");
    expect(updated.value).toBe("updatedSecretValue");
  });
});
