import { StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { ParticipantController } from "../../../src/controllers/identity-controllers/participant-controllers/participant-controller";
import { ParticipantInput } from "../../../src/entities/participant";
import {
  startPrismContainer,
  stopPrismContainer,
} from "../../prism-container";

describe("Paricipant", () => {
  let startedContainer: StartedTestContainer | undefined;
  let participant: ParticipantController;

  beforeAll(async () => {
    startedContainer = await startPrismContainer(
      "node_modules/identity-api.yml",
      "/identity-api.yml",
    );

    participant = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build()
      .identity.participant("1");
  });

  afterAll(async () => {
    await stopPrismContainer(startedContainer);
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
});
