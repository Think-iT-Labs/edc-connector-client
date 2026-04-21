import { StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { ParticipantsController } from "../../../src/controllers/identity-controllers/participants-controller";
import {
  startPrismContainer,
  stopPrismContainer,
} from "../../prism-container";

describe("Participants", () => {
  let startedContainer: StartedTestContainer | undefined;
  let participants: ParticipantsController;

  beforeAll(async () => {
    startedContainer = await startPrismContainer(
      "node_modules/identity-api.yml",
      "/identity-api.yml",
    );

    participants = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build().identity.participants;
  });

  afterAll(async () => {
    await stopPrismContainer(startedContainer);
  });

  it("should query all participants", async () => {
    const participantsList = await participants.queryAll({});

    expect(participantsList.length).toBeGreaterThan(0);
    expect(participantsList[0]).not.toBeNull();
  });

  it("should create a new participant", async () => {
    const participant = await participants.create({
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
    const participant = await participants.get(1);

    expect(participant).not.toBeNull();
    expect(participant).toHaveProperty("participantContextId");
    expect(participant).toHaveProperty("apiTokenAlias");
    expect(participant).toHaveProperty("did");
    expect(participant).toHaveProperty("roles");
    expect(participant).toHaveProperty("state");
    expect(participant).toHaveProperty("createdAt");
    expect(participant).toHaveProperty("lastModified");
  });
});
