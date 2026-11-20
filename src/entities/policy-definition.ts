import { JsonLdIdNode } from "./jsonld";
import { Policy, PolicyBody } from "./policy";

export interface PolicyDefinition extends JsonLdIdNode {
  createdAt?: number;
  policy: Policy;
  privateProperties?: Record<string, any>;
}

export interface PolicyDefinitionInput {
  "@type"?: "PolicyDefinition";
  "@id"?: string;
  id?: string;
  policy: PolicyBody;
}
