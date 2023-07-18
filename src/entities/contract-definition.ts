import { ContextProperties } from "./context";
import { Criterion } from "./criterion";

export interface ContractDefinition extends ContextProperties {
  "@id": string;
  validity?: number;
}

export interface ContractDefinitionInput extends Partial<ContractDefinition> {
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: Criterion[];
}
