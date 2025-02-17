import { GenericContainer, StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { ParticipantDIDsController } from "../../../src/controllers/identity-controllers/participant-controllers/participant-dids-controller";
import { DIDsController } from "../../../src/controllers/identity-controllers/dids-controller";

describe("DIDs", () => {
  let startedContainer: StartedTestContainer;
  let DIDs: DIDsController;
  let participantDIDs: ParticipantDIDsController;

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

    DIDs = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build().identity.DIDs;

    participantDIDs = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build()
      .identity.participant("1").dids;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should query all DIDs", async () => {
    const dids = await DIDs.queryAll();

    expect(dids).not.toBeNull();
    expect(dids.length).toBeGreaterThan(0);

    expect(dids[0]).toHaveProperty("authentication");
    expect(dids[0]).toHaveProperty("id");
    expect(dids[0]).toHaveProperty("service");
    expect(dids[0]).toHaveProperty("verificationMethod");
  });

  it.skip("should publish DID", () => {
    expect(participantDIDs.publishDID("1")).resolves.not.toThrow();
  });

  it("should get participant DIDs", async () => {
    const dids = await participantDIDs.getDIDs({});

    expect(dids).not.toBeNull();
    expect(dids.length).toBeGreaterThan(0);

    expect(dids[0]).toHaveProperty("authentication");
    expect(dids[0]).toHaveProperty("id");
    expect(dids[0]).toHaveProperty("service");
    expect(dids[0]).toHaveProperty("verificationMethod");
  });

  it.skip("should get participant DID state", async () => {
    expect(participantDIDs.getDIDstate("1")).resolves.not.toThrow();
  });

  it.skip("should unpublish participant DID", async () => {
    expect(participantDIDs.unpublishDID("1")).resolves.not.toThrow();
  });

  it.skip("should add participant DID endpoint", async () => {
    expect(
      participantDIDs.addDIDEndpoint("1", {
        id: "string",
        serviceEndpoint: "string",
        type: "string",
      }),
    ).resolves.not.toThrow();
  });

  it.skip("should delete participant DID endpoint", async () => {
    expect(
      participantDIDs.deleteDIDEndpoint("didID", "serviceID"),
    ).resolves.not.toThrow();
  });
});
