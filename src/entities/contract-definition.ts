import { ContextProperties } from "./context";
import { Criterion } from "./criterion";

export interface ContractDefinition {
  "@id": string;
  validity?: number;
}

export interface ContractDefinitionInput
  extends Partial<ContractDefinition>,
    ContextProperties {
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: Criterion[];
}
