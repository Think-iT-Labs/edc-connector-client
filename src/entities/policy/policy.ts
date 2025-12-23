import { Duty } from "./duty";
import { Permission } from "./permission";
import { Prohibition } from "./prohibition";
import { JsonLdObject } from "../jsonld";

export type PolicyType = "Set" | "Offer" | "Contract";

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
  profiles?: string[];
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

export class PolicyBuilder {
  instance: Policy = new Policy();

  constructor() {
    this.instance[`@context`] = "http://www.w3.org/ns/odrl.jsonld";
  }

  raw(data: any): PolicyBuilder {
    this.instance = Object.assign({}, this.instance, data);
    return this;
  }

  type(type: PolicyType): PolicyBuilder {
    this.instance[`@type`] = type;
    return this;
  }

  build(): Policy {
    return this.instance;
  }
}
