import { CriterionInput } from "./criterion";

export * from "./addresses";
export * from "./asset";
export * from "./catalog";
export * from "./context";
export * from "./contract-agreement";
export * from "./contract-definition";
export * from "./contract-negotiation";
export * from "./criterion";
export * from "./data-address";
export * from "./dataplane";
export * from "./edr";
export * from "./health";
export * from "./id-response";
export * from "./jsonld";
export * from "./policy-definition";
export * from "./policy";
export * from "./transfer-process";

export const EDC_NAMESPACE = "edc";

export interface ApiErrorDetail {
  invalidValue?: string;
  message?: string;
  path?: string;
  type?: string;
}

export interface QuerySpec {
  filterExpression?: CriterionInput[];
  limit?: number;
  offset?: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}
