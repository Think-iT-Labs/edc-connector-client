import { Criterion, CriterionInput } from "./criterion";
import { JsonLdIdNode } from "./jsonld";

export interface ContractDefinition extends JsonLdIdNode {
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector?: Criterion[];
  privateProperties?: Record<string, any>;
}

export interface ContractDefinitionInput {
  "@type"?: "ContractDefinition";
  "@id"?: string;
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: CriterionInput[];
  privateProperties?: Record<string, unknown>;
}
