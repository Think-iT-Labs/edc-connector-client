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
export * from "./policy";
export * from "./policy-definition";
export * from "./secret";
export * from "./transfer-process";

export const EDC_NAMESPACE = "edc";

export interface ApiErrorDetail {
  invalidValue?: string;
  message?: string;
  path?: string;
  type?: string;
}

export interface QuerySpec {
  "@type": "QuerySpec";
  filterExpression?: CriterionInput[];
  limit?: number;
  offset?: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

export const MANAGEMENT_API_VERSIONS = ["v3", "v4beta"] as const;
export type ManagementApiVersion = (typeof MANAGEMENT_API_VERSIONS)[number];
export const DEFAULT_MANAGEMENT_API_VERSION: ManagementApiVersion = "v3";
export const MANAGEMENT_API_VERSION_PATHS: Record<
  ManagementApiVersion,
  string
> = {
  v3: "/v3",
  v4beta: "/v4beta",
};
