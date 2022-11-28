import { Criterion } from "./criterion";

export interface ContractDefinition {
  id: string;
  accessPolicyId: string;
  contractPolicyId: string;
  criteria: Criterion[];
}

export type ContractDefinitionInput = ContractDefinition;
