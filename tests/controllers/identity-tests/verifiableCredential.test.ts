import { GenericContainer, StartedTestContainer } from "testcontainers";
import { EdcConnectorClient } from "../../../src";
import { ParticipantVerifiableCredentialsController } from "../../../src/controllers/identity-controllers/participant-controllers/participant-verifiable-credentials-controller";
import { VerifiableCredentialsController } from "../../../src/controllers/identity-controllers/verifiable-credentials-controller";
import { VerifiableCredentialManifest } from "../../../src/entities/verifiable-credentials";

const input: VerifiableCredentialManifest = {
  id: "string",
  issuancePolicy: {
    "@type": "SET",
    assignee: "string",
    assigner: "string",
    extensibleProperties: {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    },
    inheritsFrom: "string",
    obligations: [
      {
        action: {
          constraint: {
            edctype: "string",
          },
          includedIn: "string",
          type: "string",
        },
        constraints: [
          {
            edctype: "string",
          },
        ],
      },
    ],
    permissions: [
      {
        action: {
          constraint: {
            edctype: "string",
          },
          includedIn: "string",
          type: "string",
        },
        constraints: [
          {
            edctype: "string",
          },
        ],
        duties: [
          {
            action: {
              constraint: {
                edctype: "string",
              },
              includedIn: "string",
              type: "string",
            },
            constraints: [
              {
                edctype: "string",
              },
            ],
          },
        ],
      },
    ],
    profiles: ["string"],
    prohibitions: [
      {
        action: {
          constraint: {
            edctype: "string",
          },
          includedIn: "string",
          type: "string",
        },
        constraints: [
          {
            edctype: "string",
          },
        ],
        remedies: [
          {
            action: {
              constraint: {
                edctype: "string",
              },
              includedIn: "string",
              type: "string",
            },
            constraints: [
              {
                edctype: "string",
              },
            ],
          },
        ],
      },
    ],
    target: "string",
  },
  participantContextId: "string",
  reissuancePolicy: {
    "@type": "SET",
    assignee: "string",
    assigner: "string",
    extensibleProperties: {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    },
    inheritsFrom: "string",
    obligations: [
      {
        action: {
          constraint: {
            edctype: "string",
          },
          includedIn: "string",
          type: "string",
        },
        constraints: [
          {
            edctype: "string",
          },
        ],
      },
    ],
    permissions: [
      {
        action: {
          constraint: {
            edctype: "string",
          },
          includedIn: "string",
          type: "string",
        },
        constraints: [
          {
            edctype: "string",
          },
        ],
        duties: [
          {
            action: {
              constraint: {
                edctype: "string",
              },
              includedIn: "string",
              type: "string",
            },
            constraints: [
              {
                edctype: "string",
              },
            ],
          },
        ],
      },
    ],
    profiles: ["string"],
    prohibitions: [
      {
        action: {
          constraint: {
            edctype: "string",
          },
          includedIn: "string",
          type: "string",
        },
        constraints: [
          {
            edctype: "string",
          },
        ],
        remedies: [
          {
            action: {
              constraint: {
                edctype: "string",
              },
              includedIn: "string",
              type: "string",
            },
            constraints: [
              {
                edctype: "string",
              },
            ],
          },
        ],
      },
    ],
    target: "string",
  },
  verifiableCredentialContainer: {
    credential: {
      credentialSchema: [
        {
          id: "string",
          type: "string",
        },
      ],
      credentialStatus: [
        {
          additionalProperties: {
            additionalProp1: {},
            additionalProp2: {},
            additionalProp3: {},
          },
          id: "string",
          type: "string",
        },
      ],
      credentialSubject: [
        {
          id: "string",
        },
      ],
      dataModelVersion: "V_1_1",
      description: "string",
      expirationDate: "2025-03-17T10:22:47.600Z",
      id: "string",
      issuanceDate: "2025-03-17T10:22:47.600Z",
      issuer: {
        additionalProperties: {
          additionalProp1: {},
          additionalProp2: {},
          additionalProp3: {},
        },
        id: "string",
      },
      name: "string",
      type: ["string"],
    },
    format: "JSON_LD",
    rawVc: "string",
  },
};
describe("Verifiable Credentials", () => {
  let startedContainer: StartedTestContainer;
  let verifiableCredentials: VerifiableCredentialsController;
  let participantVerifiableCredentials: ParticipantVerifiableCredentialsController;

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

    verifiableCredentials = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build().identity.VerifiableCredentials;

    participantVerifiableCredentials = new EdcConnectorClient.Builder()
      .identityUrl("http://localhost:" + startedContainer.getFirstMappedPort())
      .build()
      .identity.participant("1").verifiableCredentials;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should query all verifiable credentials", async () => {
    const result = await verifiableCredentials.queryAll();
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("holderId");
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("issuancePolicy");
    expect(result[0]).toHaveProperty("issuerId");
    expect(result[0]).toHaveProperty("participantContextId");
    expect(result[0]).toHaveProperty("reissuancePolicy");
    expect(result[0]).toHaveProperty("state");
    expect(result[0]).toHaveProperty("timeOfLastStatusUpdate");
    expect(result[0]).toHaveProperty("timestamp");
    expect(result[0]).toHaveProperty("verifiableCredential");
  });

  it("should query all verifiable credentials for a participant", async () => {
    const result =
      await participantVerifiableCredentials.queryAllVerifiableCredential();
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("holderId");
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("issuancePolicy");
    expect(result[0]).toHaveProperty("issuerId");
    expect(result[0]).toHaveProperty("participantContextId");
    expect(result[0]).toHaveProperty("reissuancePolicy");
    expect(result[0]).toHaveProperty("state");
    expect(result[0]).toHaveProperty("timeOfLastStatusUpdate");
    expect(result[0]).toHaveProperty("timestamp");
    expect(result[0]).toHaveProperty("verifiableCredential");
  });

  it("should update verifiable credential", async () => {
    const result =
      await participantVerifiableCredentials.updateVerifiableCredential(input);

    expect(result).toBeUndefined();
  });

  it.skip("should create verifiable credential", async () => { });

  it.skip("should send verifiable credential", async () => { });

  it.skip("should get verifiable credential request", async () => {
    const result =
      await participantVerifiableCredentials.getVerifiableCredentialRequest(
        "1",
      );

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("holderId");
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("issuancePolicy");
    expect(result).toHaveProperty("issuerId");
    expect(result).toHaveProperty("participantContextId");
    expect(result).toHaveProperty("reissuancePolicy");
    expect(result).toHaveProperty("state");
    expect(result).toHaveProperty("timeOfLastStatusUpdate");
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("verifiableCredential");
  });

  it("should get verifiable credential", async () => {
    const result =
      await participantVerifiableCredentials.getVerifiableCredential("1");

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("holderId");
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("issuancePolicy");
    expect(result).toHaveProperty("issuerId");
    expect(result).toHaveProperty("participantContextId");
    expect(result).toHaveProperty("reissuancePolicy");
    expect(result).toHaveProperty("state");
    expect(result).toHaveProperty("timeOfLastStatusUpdate");
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("verifiableCredential");
  });

  it("should delete verifiable credential", async () => {
    const result =
      await participantVerifiableCredentials.deleteVerifiableCredential("1");

    expect(typeof result).toBe("string");
  });
});
