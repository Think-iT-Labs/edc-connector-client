import { Criterion } from "./criterion";
export interface ContractDefinition {
    id: string;
    accessPolicyId: string;
    contractPolicyId: string;
    criteria: Criterion[];
}
export declare type ContractDefinitionInput = ContractDefinition;
