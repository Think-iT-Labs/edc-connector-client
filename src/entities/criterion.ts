import { JsonLdObject } from "./jsonld"

export interface CriterionInput {
  operandLeft: string;
  operator: string;
  operandRight?: any;
}

export class Criterion extends JsonLdObject {
    get operandLeft(): string {
      return this.mandatoryValue('edc', 'operandLeft');
    }

    get operator(): string {
      return this.mandatoryValue('edc', 'operator')
    }

    get operandRight(): string {
      return this.mandatoryValue('edc', 'operandRight');
    }
}
