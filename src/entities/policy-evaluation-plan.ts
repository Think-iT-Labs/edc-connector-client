import { JsonLdNode } from "./jsonld";

export interface PolicyValidationResult extends JsonLdNode {
  isValid: boolean;
  errors: string[];
}

export interface PolicyEvaluationPlanRequest {
  "@type"?: "PolicyEvaluationPlanRequest";
  policyScope: string;
}

export interface ConstraintStep extends JsonLdNode {
  isFiltered?: boolean;
  filteringReasons?: string[];
  functionName?: string;
  functionParams?: string[];
  constraintSteps?: ConstraintStep[];
}

export interface RuleStep extends JsonLdNode {
  isFiltered?: boolean;
  filteringReasons?: string[];
  ruleFunctions?: string[];
  constraintSteps?: ConstraintStep[];
}

export interface DutyStep extends RuleStep {}

export interface ProhibitionStep extends RuleStep {}

export interface PermissionStep extends RuleStep {
  dutySteps?: DutyStep[];
}

export interface PolicyEvaluationPlan extends JsonLdNode {
  preValidators?: string[];
  postValidators?: string[];
  permissionSteps?: PermissionStep[];
  prohibitionSteps?: ProhibitionStep[];
  obligationSteps?: DutyStep[];
}
