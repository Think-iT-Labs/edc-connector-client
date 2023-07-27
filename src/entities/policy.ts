import { Duty } from "./duty";
import { Permission } from "./permission";
import { Prohibition } from "./prohibition";
import { JsonLdId } from "./jsonld";

export type PolicyType =
  | "set"
  | "offer"
  | "contract";

export interface Policy {
  uid?: string;
  "@context"?: string;
  "@type"?: {
    "@policytype": PolicyType;
  };
  assignee?: string;
  assigner?: string;
  extensibleProperties?: object;
  inheritsFrom?: string;
  obligations?: Duty[];
  permissions?: Permission[];
  prohibitions?: Prohibition[];
  traget?: string;
}

export class PolicyDefinition extends JsonLdId {
  createdAt?: number;
  policy?: Policy;
}

export interface PolicyDefinitionInput {
  '@id'?: string;
  id?: string;
  policy: Policy;
}
