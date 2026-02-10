import { JsonLdId, JsonLdObject } from "./jsonld";
import { Policy } from "./policy";

export interface ContractNegotiationRequest {
  counterPartyAddress: string;
  counterPartyId: string;
  policy: Policy;
}

export class ContractNegotiation extends JsonLdId {
  updatedAt?: number;
  createdAt?: number;
  counterPartyAddress?: string;
  errorDetail?: string;
  protocol?: string;
  type?: "CONSUMER" | "PROVIDER";

  get contractAgreementId(): string {
    return this.mandatoryValue('edc', 'contractAgreementId');
  }

  get state(): string {
    return this.mandatoryValue('edc', 'state');
  }
}

export class ContractNegotiationState extends JsonLdObject {
  get state(): string {
    return this.mandatoryValue('edc', 'state');
  }
}
