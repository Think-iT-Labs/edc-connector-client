import { Criterion } from "./criterion";
import { JsonLdId } from "./jsonld";

export class ContractDefinition extends JsonLdId {
  get accessPolicyId(): string {
    return this.mandatoryValue('edc', 'accessPolicyId');
  }

  get contractPolicyId(): string {
    return this.mandatoryValue('edc', 'contractPolicyId');
  }
}

export interface ContractDefinitionInput extends Partial<ContractDefinition> {
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: Criterion[];
}
