export * from "./addresses";
export * from "./asset";
export * from "./data-address";
export * from "./dataplane";
export * from "./health";

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
