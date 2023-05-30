import { Criterion } from "./criterion";

export * from "./action";
export * from "./addresses";
export * from "./asset";
export * from "./context";
export * from "./catalog";
export * from "./constraint";
export * from "./contract-agreement";
export * from "./contract-definition";
export * from "./contract-negotiation";
export * from "./contract-offer";
export * from "./criterion";
export * from "./data-address";
export * from "./dataplane";
export * from "./duty";
export * from "./jsonld";
export * from "./health";
export * from "./permission";
export * from "./policy";
export * from "./prohibition";
export * from "./transfer-process";

export const EDC_NAMESPACE = "edc";

export interface CreateResult {
  "edc:createdAt": number;
  "@id": string;
}

export interface ApiErrorDetail {
  invalidValue?: string;
  message?: string;
  path?: string;
  type?: string;
}

export interface QuerySpec {
  filter?: string;
  filterExpression?: Criterion[];
  limit?: number;
  offset?: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}
