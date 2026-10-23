import { EDC_CONTEXT } from "../../src/entities/context";
import {
  JsonLdService,
  PolicyEvaluationPlan,
  PolicyValidationResult,
} from "../../src";

const vocabContext = { "@context": { "@vocab": EDC_CONTEXT } };

describe("PolicyValidationResult", () => {
  const service = new JsonLdService();

  it("parses isValid and errors", async () => {
    const result = await service.expand(
      {
        ...vocabContext,
        "@type": "PolicyValidationResult",
        isValid: false,
        errors: ["first error", "second error"],
      },
      () => new PolicyValidationResult(),
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(["first error", "second error"]);
  });

  it("defaults errors to an empty array when absent", async () => {
    const result = await service.expand(
      {
        ...vocabContext,
        "@type": "PolicyValidationResult",
        isValid: true,
      },
      () => new PolicyValidationResult(),
    );

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

describe("PolicyEvaluationPlan", () => {
  const service = new JsonLdService();

  it("parses the full nested plan tree", async () => {
    const plan = await service.expand(
      {
        ...vocabContext,
        "@type": "PolicyEvaluationPlan",
        preValidators: ["PreValidatorA", "PreValidatorB"],
        postValidators: ["PostValidatorA"],
        permissionSteps: [
          {
            "@type": "PermissionStep",
            isFiltered: false,
            filteringReasons: [],
            ruleFunctions: ["PermissionFunction"],
            constraintSteps: [
              {
                "@type": "AtomicConstraintStep",
                isFiltered: true,
                filteringReasons: ["no evaluator"],
                functionName: "edc:inForceDate",
                functionParams: ["param1", "param2"],
              },
              {
                "@type": "AndConstraintStep",
                constraintSteps: [
                  {
                    "@type": "AtomicConstraintStep",
                    functionName: "edc:nested",
                  },
                ],
              },
            ],
            dutySteps: [
              {
                "@type": "DutyStep",
                isFiltered: false,
                ruleFunctions: ["DutyFunction"],
              },
            ],
          },
        ],
        prohibitionSteps: [
          {
            "@type": "ProhibitionStep",
            isFiltered: true,
            filteringReasons: ["prohibited"],
            ruleFunctions: ["ProhibitionFunction"],
          },
        ],
        obligationSteps: [
          {
            "@type": "DutyStep",
            isFiltered: false,
            ruleFunctions: ["ObligationFunction"],
          },
        ],
      },
      () => new PolicyEvaluationPlan(),
    );

    expect(plan.preValidators).toEqual(["PreValidatorA", "PreValidatorB"]);
    expect(plan.postValidators).toEqual(["PostValidatorA"]);

    expect(plan.permissionSteps).toHaveLength(1);
    const permissionStep = plan.permissionSteps[0];
    expect(permissionStep.isFiltered).toBe(false);
    expect(permissionStep.ruleFunctions).toEqual(["PermissionFunction"]);

    expect(permissionStep.constraintSteps).toHaveLength(2);
    const atomic = permissionStep.constraintSteps[0];
    expect(atomic.isFiltered).toBe(true);
    expect(atomic.filteringReasons).toEqual(["no evaluator"]);
    expect(atomic.functionName).toBe("edc:inForceDate");
    expect(atomic.functionParams).toEqual(["param1", "param2"]);

    const andStep = permissionStep.constraintSteps[1];
    expect(andStep.constraintSteps).toHaveLength(1);
    expect(andStep.constraintSteps[0].functionName).toBe("edc:nested");

    expect(permissionStep.dutySteps).toHaveLength(1);
    expect(permissionStep.dutySteps[0].ruleFunctions).toEqual(["DutyFunction"]);

    expect(plan.prohibitionSteps).toHaveLength(1);
    expect(plan.prohibitionSteps[0].isFiltered).toBe(true);
    expect(plan.prohibitionSteps[0].ruleFunctions).toEqual([
      "ProhibitionFunction",
    ]);

    expect(plan.obligationSteps).toHaveLength(1);
    expect(plan.obligationSteps[0].ruleFunctions).toEqual([
      "ObligationFunction",
    ]);
  });

  it("defaults step collections to empty arrays when absent", async () => {
    const plan = await service.expand(
      {
        ...vocabContext,
        "@type": "PolicyEvaluationPlan",
      },
      () => new PolicyEvaluationPlan(),
    );

    expect(plan.preValidators).toEqual([]);
    expect(plan.postValidators).toEqual([]);
    expect(plan.permissionSteps).toEqual([]);
    expect(plan.prohibitionSteps).toEqual([]);
    expect(plan.obligationSteps).toEqual([]);
  });
});
