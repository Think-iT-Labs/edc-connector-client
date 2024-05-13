import { EdcConnectorClient, PolicyBuilder, PolicyDefinitionInput } from "../src";

describe("E2E tests", () => {
  const edcClient = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  const policyDefinitions = edcClient.management.policyDefinitions;

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
  });
});
