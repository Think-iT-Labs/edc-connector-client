import { Duty } from "./duty";
import { Permission } from "./permission";
import { Prohibition } from "./prohibition";
import { JsonLdObject } from "../jsonld";

export type PolicyType =
  | "set"
  | "offer"
  | "contract";

export interface PolicyInput {
  uid?: string;
  "@context"?: string;
  "@type"?: PolicyType;
  assignee?: string;
  assigner?: string;
  extensibleProperties?: object;
  inheritsFrom?: string;
  obligations?: Duty[];
  permission?: Permission[];
  prohibitions?: Prohibition[];
  target?: string;
}

export class Policy extends JsonLdObject {

  get permissions(): JsonLdObject[] {
    return this.arrayOf(() => new JsonLdObject(), "odrl", "permission");
  }
}
