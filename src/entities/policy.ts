import { Duty } from "./duty";
import { Permission } from "./permission";
import { Prohibition } from "./prohibition";

export enum PolicyType {
  SET = "SET",
  OFFER = "OFFER",
  CONTRACT = "CONTRACT",
}

export interface Policy {
  "@type"?: PolicyType;
  assignee?: string;
  assigner?: string;
  extensibleProperties?: object;
  inheritsFrom?: string;
  obligations?: Duty[];
  permissions?: Permission[];
  prohibitions?: Prohibition[];
  traget?: string;
}

export interface PolicyDefinition {
  id: string;
  createdAt: number;
  policy: Policy;
}

export interface PolicyDefinitionInput {
  id?: string;
  policy: Policy;
}
