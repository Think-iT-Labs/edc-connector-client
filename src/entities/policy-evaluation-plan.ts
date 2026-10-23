import { JsonLdObject, JsonLdValue } from "./jsonld";

export class PolicyValidationResult extends JsonLdObject {
  get isValid(): boolean {
    return this.mandatoryValue("edc", "isValid");
  }

  get errors(): string[] {
    return this.arrayOf(() => new JsonLdValue<string>(), "edc", "errors").map(
      (it) => it.value,
    );
  }
}

export interface PolicyEvaluationPlanRequest {
  "@type"?: "PolicyEvaluationPlanRequest";
  policyScope: string;
}

export class ConstraintStep extends JsonLdObject {
  get isFiltered(): boolean | undefined {
    return this.optionalValue("edc", "isFiltered");
  }

  get filteringReasons(): string[] {
    return this.arrayOf(
      () => new JsonLdValue<string>(),
      "edc",
      "filteringReasons",
    ).map((it) => it.value);
  }

  get functionName(): string | undefined {
    return this.optionalValue("edc", "functionName");
  }

  get functionParams(): string[] {
    return this.arrayOf(
      () => new JsonLdValue<string>(),
      "edc",
      "functionParams",
    ).map((it) => it.value);
  }

  get constraintSteps(): ConstraintStep[] {
    return this.arrayOf(() => new ConstraintStep(), "edc", "constraintSteps");
  }
}

export class RuleStep extends JsonLdObject {
  get isFiltered(): boolean | undefined {
    return this.optionalValue("edc", "isFiltered");
  }

  get filteringReasons(): string[] {
    return this.arrayOf(
      () => new JsonLdValue<string>(),
      "edc",
      "filteringReasons",
    ).map((it) => it.value);
  }

  get ruleFunctions(): string[] {
    return this.arrayOf(
      () => new JsonLdValue<string>(),
      "edc",
      "ruleFunctions",
    ).map((it) => it.value);
  }

  get constraintSteps(): ConstraintStep[] {
    return this.arrayOf(() => new ConstraintStep(), "edc", "constraintSteps");
  }
}

export class DutyStep extends RuleStep {}

export class ProhibitionStep extends RuleStep {}

export class PermissionStep extends RuleStep {
  get dutySteps(): DutyStep[] {
    return this.arrayOf(() => new DutyStep(), "edc", "dutySteps");
  }
}

export class PolicyEvaluationPlan extends JsonLdObject {
  get preValidators(): string[] {
    return this.arrayOf(
      () => new JsonLdValue<string>(),
      "edc",
      "preValidators",
    ).map((it) => it.value);
  }

  get postValidators(): string[] {
    return this.arrayOf(
      () => new JsonLdValue<string>(),
      "edc",
      "postValidators",
    ).map((it) => it.value);
  }

  get permissionSteps(): PermissionStep[] {
    return this.arrayOf(() => new PermissionStep(), "edc", "permissionSteps");
  }

  get prohibitionSteps(): ProhibitionStep[] {
    return this.arrayOf(() => new ProhibitionStep(), "edc", "prohibitionSteps");
  }

  get obligationSteps(): DutyStep[] {
    return this.arrayOf(() => new DutyStep(), "edc", "obligationSteps");
  }
}
