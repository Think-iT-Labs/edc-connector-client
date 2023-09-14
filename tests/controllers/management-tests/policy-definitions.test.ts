import * as crypto from "node:crypto";
import {
  EdcConnectorClient,
  PolicyDefinitionInput,
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
      // given
      const id = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        "@id": id,
        policy: { },
      };

      // when
      const idResponse = await policyDefinitions.create(policyInput);

      // then
      expect(idResponse.id).toBe(id);
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("fails creating two policies with the same id", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };

      // when
      await policyDefinitions.create(policyInput);
      const maybeCreateResult = policyDefinitions.create(policyInput);

      // then
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
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await policyDefinitions.create(policyInput);

      // when
      const policies = await policyDefinitions.queryAll();

      // then
      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy["@id"] === policyInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("get", () => {
    it("succesfully return a policy definition", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        policy: {
          "@type": "set",
          "@context": "http://www.w3.org/ns/odrl.jsonld",
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
        },
      };
      const idResponse = await policyDefinitions.create(policyInput);

      // when
      const policyDefinition = await policyDefinitions.get(idResponse.id);

      // then
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
      // when
      const maybePolicy = policyDefinitions.get(
        crypto.randomUUID(),
      );

      // then
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
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await policyDefinitions.create(policyInput);

      // when
      const policy = await policyDefinitions.delete(
        policyInput["@id"]!,
      );

      // then
      expect(policy).toBeUndefined();
    });

    it("fails to delete an not existant policy", async () => {
      // when
      const maybeAsset = policyDefinitions.delete(
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });
});
