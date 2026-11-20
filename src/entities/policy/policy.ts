import { Duty } from "./duty";
import { Permission } from "./permission";
import { Prohibition } from "./prohibition";
import { JsonLdNode } from "../jsonld";
import { definePolicyAccessors } from "../jsonld/legacy-accessors";

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

/**
 * The body of an ODRL policy, as sent to or returned by the connector.
 */
export interface PolicyBody extends JsonLdNode {
  assignee?: string;
  assigner?: string;
  target?: string;
  profile?: string | string[];
  permission?: Permission[];
  prohibition?: Prohibition[];
  obligation?: Duty[];
}

/**
 * A policy returned by the connector or built with `PolicyBuilder`.
 */
export interface Policy extends PolicyBody {
  /** @deprecated since 0.12.0: use `permission`, which is absent when empty */
  readonly permissions: Permission[];
  /** @deprecated since 0.12.0: use `prohibition`, which is absent when empty */
  readonly prohibitions: Prohibition[];
  /** @deprecated since 0.12.0: use `obligation`, which is absent when empty */
  readonly obligations: Duty[];
}

export class PolicyBuilder {
  instance: PolicyBody = {};

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
    return definePolicyAccessors(this.instance) as Policy;
  }
}
