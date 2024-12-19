import { GenericContainer, StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { KeyPairsController } from "../../../src/controllers/identity-controllers/keypairs-controller";
import { ParticipantKeyPairContoller } from "../../../src/controllers/identity-controllers/participant-controllers/participant-keypairs-controller";
import { KeyDescriptor } from "../../../src/entities/keypairs";

describe("Key Pairs", () => {
  let startedContainer: StartedTestContainer;
  let participantKeyPairs: ParticipantKeyPairContoller;
  let keyPairs: KeyPairsController;

  beforeAll(async () => {
    startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
      .withCopyFilesToContainer([
        {
          source: "node_modules/identity-api.yml",
          target: "/identity-api.yml",
        },
      ])
      .withCommand(["mock", "-h", "0.0.0.0", "/identity-api.yml"])
      .withExposedPorts(4010)
      .start();

    keyPairs = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build().identity.keyPairs;

    participantKeyPairs = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build()
      .identity.participant("1").keypairs;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should query all key pairs", async () => {
    const keyPairs = await participantKeyPairs.queryAllKeyPairs();

    expect(keyPairs).not.toBeNull();
    expect(keyPairs.length).toBeGreaterThan(0);
    expect(keyPairs[0]).toHaveProperty("defaultPair");
    expect(keyPairs[0]).toHaveProperty("groupName");
    expect(keyPairs[0]).toHaveProperty("id");
    expect(keyPairs[0]).toHaveProperty("keyContext");
    expect(keyPairs[0]).toHaveProperty("keyId");
    expect(keyPairs[0]).toHaveProperty("participantId");
    expect(keyPairs[0]).toHaveProperty("privateKeyAlias");
    expect(keyPairs[0]).toHaveProperty("rotationDuration");
    expect(keyPairs[0]).toHaveProperty("serializedPublicKey");
    expect(keyPairs[0]).toHaveProperty("state");
    expect(keyPairs[0]).toHaveProperty("timestamp");
    expect(keyPairs[0]).toHaveProperty("useDuration");
  });

  it("should get key pair", async () => {
    const keyPair = await participantKeyPairs.getKeyPair("1");

    expect(keyPair).not.toBeNull();
    expect(keyPair).toHaveProperty("defaultPair");
    expect(keyPair).toHaveProperty("groupName");
    expect(keyPair).toHaveProperty("id");
    expect(keyPair).toHaveProperty("keyContext");
    expect(keyPair).toHaveProperty("keyId");
    expect(keyPair).toHaveProperty("participantId");
    expect(keyPair).toHaveProperty("privateKeyAlias");
    expect(keyPair).toHaveProperty("rotationDuration");
    expect(keyPair).toHaveProperty("serializedPublicKey");
    expect(keyPair).toHaveProperty("state");
    expect(keyPair).toHaveProperty("timestamp");
    expect(keyPair).toHaveProperty("useDuration");
  });

  it("should create a key pair", async () => {
    const newKeyDescriptor: KeyDescriptor = {
      privateKeyAlias: "",
      type: "",
      keyId: "",
      active: true,
      resourceId: "",
      publicKeyJwk: {},
      publicKeyPem: "",
      keyGeneratorParams: {},
    };

    expect(
      participantKeyPairs.createKeyPair(newKeyDescriptor),
    ).resolves.not.toThrow();
  });

  it("should query All", () => {
    const keyPairsList = keyPairs.queryAll();

    expect(keyPairsList).not.toBeNull();
  });

  it("should activate a key pair", () => {
    expect(participantKeyPairs.activate("1")).resolves.not.toThrow();
  });

  it("should revoke a key pair", () => {
    const newKeyDescriptor: KeyDescriptor = {
      privateKeyAlias: "",
      type: "",
      keyId: "",
      active: true,
      resourceId: "",
      publicKeyJwk: {},
      publicKeyPem: "",
      keyGeneratorParams: {},
    };

    expect(
      participantKeyPairs.revoke("1", newKeyDescriptor),
    ).resolves.not.toThrow();
  });

  it("should rotate a key pair", () => {
    expect(participantKeyPairs.rotate("1")).resolves.not.toThrow();
  });
});
