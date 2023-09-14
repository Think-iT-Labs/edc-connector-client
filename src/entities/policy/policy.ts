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
  obligation?: Duty[];
  permission?: Permission[];
  prohibition?: Prohibition[];
  target?: string;
}

export class Policy extends JsonLdObject {

  get permissions(): JsonLdObject[] {
    return this.arrayOf(() => new JsonLdObject(), "odrl", "permission");
  }

  get prohibitions(): JsonLdObject[] {
    return this.arrayOf(() => new JsonLdObject(), "odrl", "prohibition");
  }

  get obligations(): JsonLdObject[] {
    return this.arrayOf(() => new JsonLdObject(), "odrl", "obligation");
  }
}
