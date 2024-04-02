import * as crypto from "node:crypto";
import {
  EdcConnectorClient,
  PolicyBuilder,
  PolicyDefinitionInput
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("PolicyDefinitionController", () => {
  const edcClient = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  const policyDefinitions = edcClient.management.policyDefinitions;

  describe("create", () => {
    it("succesfully creates a new policy", async () => {
      const id = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        "@id": id,
        policy: new PolicyBuilder()
          .type("Set")
          .build(),
      };

      ;

      const idResponse = await policyDefinitions.create(policyInput);

      expect(idResponse.id).toBe(id);
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("fails creating two policies with the same id", async () => {
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: new PolicyBuilder()
          .type("Set")
          .build(),
      };

      await policyDefinitions.create(policyInput);
      const maybeCreateResult = policyDefinitions.create(policyInput);

      await expect(maybeCreateResult).rejects.toThrowError(
        "duplicated resource",
      );

      maybeCreateResult.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("queryAll", () => {
    it("succesfully retuns a list of policy definitions", async () => {
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: new PolicyBuilder()
          .type("Set")
          .build(),
      };
      await policyDefinitions.create(policyInput);

      const policies = await policyDefinitions.queryAll();

      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy["@id"] === policyInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("get", () => {
    it("succesfully return a policy definition", async () => {
      const policyInput: PolicyDefinitionInput = {
        policy: new PolicyBuilder()
          .type("Set")
          .raw({
            permission: [
              {
                action: "use",
                constraint: [
                  {
                    leftOperand: "field",
                    operator: "eq",
                    rightOperand: "value"
                  },
                  {
                    "@type": "LogicalConstraint",
                    "and": [{
                        leftOperand: "field2",
                        operator: "eq",
                        rightOperand: "value"
                      },
                      {
                        leftOperand: "field3",
                        operator: "eq",
                        rightOperand: "value"
                      }
                    ]
                  }
                ]
              }
            ],
            prohibition: [
              {
                action: "use",
                constraint: [
                  {
                    leftOperand: "field",
                    operator: "eq",
                    rightOperand: "value"
                  }
                ]
              }
            ],
            obligation: [
              {
                action: "use",
                constraint: [
                  {
                    leftOperand: "field",
                    operator: "eq",
                    rightOperand: "value"
                  }
                ]
              }
            ]
          })
          .build(),
      };
      const idResponse = await policyDefinitions.create(policyInput);

      const policyDefinition = await policyDefinitions.get(idResponse.id);

      expect(policyDefinition.id).toBe(idResponse.id);
      expect(policyDefinition.policy.permissions).toHaveLength(1);
      const permissionConstraints = policyDefinition.policy.permissions[0].array("odrl", "constraint");
      expect(permissionConstraints).toHaveLength(2);
      expect(permissionConstraints[0].mandatoryValue("odrl", "leftOperand")).toBe("https://w3id.org/edc/v0.0.1/ns/field");
      expect(permissionConstraints[1].array("odrl", "and")).toHaveLength(2);
      expect(policyDefinition.policy.prohibitions).toHaveLength(1);
      const prohibitionsConstraints = policyDefinition.policy.prohibitions[0].array("odrl", "constraint");
      expect(prohibitionsConstraints).toHaveLength(1);
      expect(policyDefinition.policy.obligations).toHaveLength(1);
      const obligationsConstraints = policyDefinition.policy.obligations[0].array("odrl", "constraint");
      expect(obligationsConstraints).toHaveLength(1);
    });

    it("fails to fetch an not existant policy", async () => {
      const maybePolicy = policyDefinitions.get(
        crypto.randomUUID(),
      );

      await expect(maybePolicy).rejects.toThrowError("resource not found");

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("update", () => {
    it("updates a target policy", async () => {
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: new PolicyBuilder()
          .type("Set")
          .build(),
      };
      await policyDefinitions.create(policyInput);
      const updatedPolicyDefinitionInput = {
        "@id": policyInput["@id"]!,
        policy: new PolicyBuilder()
          .type("Set")
          .build(),
      }

      const policy = await policyDefinitions.update(policyInput["@id"]!,updatedPolicyDefinitionInput);

      expect(policy).toBeUndefined();
    });

    it("fails to update an not existant policy", async () => {
      const maybePolicy = policyDefinitions.update(
        crypto.randomUUID(),
        {
          "@id": crypto.randomUUID(),
          policy: new PolicyBuilder()
            .type("Set")
            .build(),
        }
      );

      await expect(maybePolicy).rejects.toThrowError("resource not found");

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("delete", () => {
    it("deletes a target policy", async () => {
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: new PolicyBuilder()
          .type("Set")
          .build(),
      };
      await policyDefinitions.create(policyInput);

      const policy = await policyDefinitions.delete(
        policyInput["@id"]!,
      );

      expect(policy).toBeUndefined();
    });

    it("fails to delete an not existant policy", async () => {
      const maybePolicy = policyDefinitions.delete(
        crypto.randomUUID(),
      );

      await expect(maybePolicy).rejects.toThrowError("resource not found");

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });
});
