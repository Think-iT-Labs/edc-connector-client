import { GenericContainer, StartedTestContainer } from "testcontainers";
import { PolicyDefinitionController } from "../../../src/controllers";
import {
  EdcConnectorClient,
  PolicyBuilder,
  PolicyDefinitionInput
} from "../../../src";

describe("PolicyDefinitionController", () => {
  let startedContainer: StartedTestContainer;
  let policyDefinitions: PolicyDefinitionController;

  beforeAll(async () => {
    startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
      .withCopyFilesToContainer([{ source: "node_modules/management-api.yml", target: "/management-api.yml" }])
      .withCommand(["mock", "-h", "0.0.0.0", "/management-api.yml"])
      .withExposedPorts(4010)
      .start();

      policyDefinitions = new EdcConnectorClient.Builder()
        .managementUrl("http://localhost:" + startedContainer.getFirstMappedPort())
        .build()
        .management.policyDefinitions;
  });

  afterAll(async () => {
    await startedContainer.stop();
  });

  it("should create policy definition", async () => {
    const policyInput: PolicyDefinitionInput = {
      policy: new PolicyBuilder()
        .type("Set")
        .build(),
    };

    const idResponse = await policyDefinitions.create(policyInput);

    expect(idResponse.id).not.toBeNull();
    expect(idResponse.createdAt).toBeGreaterThan(0);
  });

  it("should query policy definitions", async () => {
    const result = await policyDefinitions.queryAll();

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).not.toBeNull();
  });

  it("should get a policy definition", async () => {
    const policyDefinition = await policyDefinitions.get("policyDefinitionId");

    expect(policyDefinition.id).not.toBeNull();
    expect(policyDefinition.policy.permissions.length).toBeGreaterThan(0);
    const permissionConstraints = policyDefinition.policy.permissions[0].array("odrl", "constraint");
    expect(permissionConstraints.length).toBeGreaterThan(0);
    expect(permissionConstraints[0].mandatoryValue("odrl", "leftOperand")).not.toBeNull();
    expect(permissionConstraints[1].array("odrl", "and")).toHaveLength(2);
  });

  it("should update a policy definition", async () => {
    const updatedPolicyDefinitionInput = {
      "@id": "policyDefinitionId",
      policy: new PolicyBuilder()
        .type("Set")
        .build(),
    }

    const policy = await policyDefinitions
      .update("policyDefinitionId", updatedPolicyDefinitionInput);

    expect(policy).toBeUndefined();
  });

  it("should delete a policy definition", async () => {
    const policy = await policyDefinitions.delete("policyDefinitionId");

    expect(policy).toBeUndefined();
  });
});
