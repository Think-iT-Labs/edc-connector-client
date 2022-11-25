import { Criterion } from "./criterion";

export * from "./addresses";
export * from "./asset";
export * from "./criterion";
export * from "./data-address";
export * from "./dataplane";
export * from "./duty";
export * from "./health";
export * from "./permission";
export * from "./policy";
export * from "./prohibition";

export interface CreateResult {
  createdAt: number;
  id: string;
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
