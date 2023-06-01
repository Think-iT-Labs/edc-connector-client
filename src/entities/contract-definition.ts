import { Criterion } from "./criterion";

export interface ContractDefinitionInput {
  '@id'?: string;
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: Criterion[];
}
export interface ContractDefinition extends ContractDefinitionInput {
  createdAt: number;
  validity?: number;
}
