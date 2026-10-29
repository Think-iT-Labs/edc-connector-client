import * as crypto from "node:crypto";
import {
  EdcConnectorClient,
  PolicyBuilder,
  PolicyDefinitionInput,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("PolicyDefinitionController", () => {
  const v4Client = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .build();

  const v4PolicyDefinitions = v4Client.management.policyDefinitions;

  const buildPolicyInput = (id: string): PolicyDefinitionInput => ({
    "@id": id,
    "@type": "PolicyDefinition",
    policy: new PolicyBuilder().type("Set").build(),
  });

  const buildRawPolicyInput = (): PolicyDefinitionInput => ({
    "@type": "PolicyDefinition",
    policy: new PolicyBuilder()
      .type("Set")
      .raw({
        permission: [
          {
            action: "use",
            constraint: [
              {
                leftOperand: "https://w3id.org/edc/v0.0.1/ns/inForceDate",
                operator: "odrl:gteq",
                rightOperand: {
                  "@value": "2023-01-01T00:00:01Z",
                  "@type": "xsd:datetime",
                },
              },
              {
                "@type": "LogicalConstraint",
                "odrl:and": [
                  {
                    leftOperand: "https://w3id.org/edc/v0.0.1/ns/inForceDate",
                    operator: "odrl:gteq",
                    rightOperand: {
                      "@value": "2023-01-01T00:00:01Z",
                      "@type": "xsd:datetime",
                    },
                  },
                  {
                    leftOperand: "https://w3id.org/edc/v0.0.1/ns/inForceDate",
                    operator: "odrl:lteq",
                    rightOperand: {
                      "@value": "2024-01-01T00:00:01Z",
                      "@type": "xsd:datetime",
                    },
                  },
                ],
              },
            ],
          },
        ],
        prohibition: [
          {
            action: "use",
          },
        ],
        obligation: [
          {
            action: "use",
          },
        ],
      })
      .build(),
  });

  const runPolicyTests = (label: string, policyDefinitions: any): void => {
    describe(label, () => {
      describe("create", () => {
        it("succesfully creates a new policy", async () => {
          const id = crypto.randomUUID();
          const policyInput = buildPolicyInput(id);

          const idResponse = await policyDefinitions.create(policyInput);

          expect(idResponse.id).toBe(id);
          expect(idResponse.createdAt).toBeGreaterThan(0);
        });

        it("fails creating two policies with the same id", async () => {
          const policyInput = buildPolicyInput(crypto.randomUUID());

          await policyDefinitions.create(policyInput);
          const maybeCreateResult = policyDefinitions.create(policyInput);

          await expect(maybeCreateResult).rejects.toThrow(
            "duplicated resource",
          );

          maybeCreateResult.catch((error: unknown) => {
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
          const policyInput = buildPolicyInput(crypto.randomUUID());
          await policyDefinitions.create(policyInput);

          const policies = await policyDefinitions.queryAll();

          expect(policies.length).toBeGreaterThan(0);
          expect(
            policies.find(
              (policy: any) => policy["@id"] === policyInput["@id"],
            ),
          ).toBeTruthy();
        });
      });

      describe("get", () => {
        it("succesfully return a policy definition", async () => {
          const policyInput = buildRawPolicyInput();
          const idResponse = await policyDefinitions.create(policyInput);

          const policyDefinition = await policyDefinitions.get(idResponse.id);

          expect(policyDefinition.id).toBe(idResponse.id);
          expect(policyDefinition.policy.permissions).toHaveLength(1);
          const permissionConstraints =
            policyDefinition.policy.permissions[0].array("odrl", "constraint");

          expect(permissionConstraints).toHaveLength(2);
          expect(
            permissionConstraints[0].array("odrl", "leftOperand")[0]["@id"],
          ).toBe("https://w3id.org/edc/v0.0.1/ns/inForceDate");
          expect(permissionConstraints[1].array("odrl", "and")).toHaveLength(2);
          expect(policyDefinition.policy.prohibitions).toHaveLength(1);
        });

        it("fails to fetch an not existant policy", async () => {
          const maybePolicy = policyDefinitions.get(crypto.randomUUID());

          await expect(maybePolicy).rejects.toThrow("resource not found");

          maybePolicy.catch((error: unknown) => {
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
          const policyInput = buildPolicyInput(crypto.randomUUID());
          await policyDefinitions.create(policyInput);
          const updatedPolicyDefinitionInput = {
            "@type": "PolicyDefinition",
            "@id": policyInput["@id"]!,
            policy: new PolicyBuilder().type("Set").build(),
          };

          const policy = await policyDefinitions.update(
            policyInput["@id"]!,
            updatedPolicyDefinitionInput,
          );

          expect(policy).toBeUndefined();
        });

        it("fails to update an not existant policy", async () => {
          const maybePolicy = policyDefinitions.update(crypto.randomUUID(), {
            "@type": "PolicyDefinition",
            "@id": crypto.randomUUID(),
            policy: new PolicyBuilder().type("Set").build(),
          });

          await expect(maybePolicy).rejects.toThrow("resource not found");

          maybePolicy.catch((error: unknown) => {
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
          const policyInput = buildPolicyInput(crypto.randomUUID());
          await policyDefinitions.create(policyInput);

          const policy = await policyDefinitions.delete(policyInput["@id"]!);

          expect(policy).toBeUndefined();
        });

        it("fails to delete an not existant policy", async () => {
          const maybePolicy = policyDefinitions.delete(crypto.randomUUID());

          await expect(maybePolicy).rejects.toThrow("resource not found");

          maybePolicy.catch((error: unknown) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("validate", () => {
        it("validates an existing policy", async () => {
          const policyInput = buildPolicyInput(crypto.randomUUID());
          const idResponse = await policyDefinitions.create(policyInput);

          const result = await policyDefinitions.validate(idResponse.id);

          expect(result.isValid).toBe(true);
          expect(result.errors).toEqual([]);
        });

        it("fails to validate a non-existent policy", async () => {
          const maybeResult = policyDefinitions.validate(crypto.randomUUID());

          await expect(maybeResult).rejects.toThrow("resource not found");

          maybeResult.catch((error: unknown) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("evaluationPlan", () => {
        it("returns the evaluation plan for an existing policy", async () => {
          const policyInput = buildPolicyInput(crypto.randomUUID());
          const idResponse = await policyDefinitions.create(policyInput);

          const plan = await policyDefinitions.evaluationPlan(
            idResponse.id,
            "catalog",
          );

          expect(plan.types()).toContain(
            "https://w3id.org/edc/v0.0.1/ns/PolicyEvaluationPlan",
          );
          expect(Array.isArray(plan.preValidators)).toBe(true);
          expect(Array.isArray(plan.postValidators)).toBe(true);
          expect(Array.isArray(plan.permissionSteps)).toBe(true);
          expect(Array.isArray(plan.prohibitionSteps)).toBe(true);
          expect(Array.isArray(plan.obligationSteps)).toBe(true);
        });

        it("fails to create a plan for a non-existent policy", async () => {
          const maybePlan = policyDefinitions.evaluationPlan(
            crypto.randomUUID(),
            "catalog",
          );

          await expect(maybePlan).rejects.toThrow("resource not found");

          maybePlan.catch((error: unknown) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });
    });
  };

  runPolicyTests("v4", v4PolicyDefinitions);
});
