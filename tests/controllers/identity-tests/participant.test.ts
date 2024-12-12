import { GenericContainer, StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { ParticipantController } from "../../../src/controllers/identity-controllers/participant-controllers/participant-controller";
import { ParticipantInput } from "../../../src/entities/participant";

describe("Paricipant", () => {
  let startedContainer: StartedTestContainer;
  let participant: ParticipantController;

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

    participant = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build()
      .identity.participant("1");
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should delete participant", async () => {
    const result = await participant.delete();

    expect(result).not.toBeNull();
  });

  it.skip("should update roles", async () => {});

  it("should update state", async () => {
    const body: ParticipantInput = {
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
    };
    const result = await participant.updateState(true, body);

    expect(result).not.toBeNull();
  });

  it("should regenerate token", async () => {
    const body: ParticipantInput = {
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
    };

    const result = participant.regenerateToken(body);

    expect(result).not.toBeNull();
  });
});
