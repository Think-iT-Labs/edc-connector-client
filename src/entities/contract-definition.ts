import { Criterion, CriterionInput } from "./criterion";
import { JsonLdId } from "./jsonld";

export class ContractDefinition extends JsonLdId {
  get accessPolicyId(): string {
    return this.mandatoryValue('edc', 'accessPolicyId');
  }

  get contractPolicyId(): string {
    return this.mandatoryValue('edc', 'contractPolicyId');
  }

  get assetsSelector(): Criterion[] {
    return this.arrayOf(() => new Criterion(), 'edc', 'assetsSelector')
  }
}

export interface ContractDefinitionInput {
  "@id"?: string,
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: CriterionInput[];
}
