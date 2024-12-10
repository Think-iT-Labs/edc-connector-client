import { GenericContainer, StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { ParticipantsController } from "../../../src/controllers/identity-hub-controllers/participants-controller";
import { ParticipantController } from "../../../src/controllers/identity-hub-controllers/participant-controller";

describe("Participants", () => {
  let startedContainer: StartedTestContainer;
  let identity: { participants: ParticipantsController };

  beforeAll(async () => {
    startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
      .withCopyFilesToContainer([
        {
          source: "node_modules/identity-hub-api.yml",
          target: "/identity-hub-api.yml",
        },
      ])
      .withCommand(["mock", "-h", "0.0.0.0", "/identity-hub-api.yml"])
      .withExposedPorts(4010)
      .start();

    identity = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build().identity;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should query all participants", async () => {
    const participants = await identity.participants.queryAll({});

    expect(participants.length).toBeGreaterThan(0);
    expect(participants[0]).not.toBeNull();
  });

  it("should create a new participant", async () => {
    const participant = await identity.participants.create({
      active: true,
      additionalProperties: {
        additionalProp1: {},
        additionalProp2: {},
        additionalProp3: {},
      },
      did: "string",
      key: {
        active: true,
        keyGeneratorParams: {
          additionalProp1: {},
          additionalProp2: {},
          additionalProp3: {},
        },
        keyId: "string",
        privateKeyAlias: "string",
        publicKeyJwk: {
          additionalProp1: {},
          additionalProp2: {},
          additionalProp3: {},
        },
        publicKeyPem: "string",
        resourceId: "string",
        type: "string",
      },
      participantId: "string",
      roles: ["string"],
      serviceEndpoints: [
        {
          id: "string",
          serviceEndpoint: "string",
          type: "string",
        },
      ],
    });

    expect(participant).not.toBeNull();
    expect(participant).toHaveProperty("apiKey");
    expect(participant).toHaveProperty("clientId");
    expect(participant).toHaveProperty("clientSecret");
  });

  it("should get a participant by Id", async () => {
    const participant = await identity.participants.get(1);

    expect(participant).toBeInstanceOf(ParticipantController);
    // prisms cannot return the same Id As the one we request
    expect(participant.participantId).not.toBeNull();
  });
});
