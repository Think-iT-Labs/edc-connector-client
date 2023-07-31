import { JsonLdId, JsonLdObject } from "./jsonld";

export interface ContractNegotiationRequest {
  connectorAddress: string;
  connectorId: string;
  providerId: string;
  offer: {
    offerId: string;
    assetId: string;
    policy: any;
  };
}

export class ContractNegotiation extends JsonLdId {
  updatedAt?: number;
  createdAt?: number;
  counterPartyAddress?: string;
  errorDetail?: string;
  protocol?: string;
  state?: string;
  type?: "CONSUMER" | "PROVIDER";

  get contractAgreementId(): string {
    return this.mandatoryValue('edc', 'contractAgreementId');
  }
}

export class ContractNegotiationState extends JsonLdObject {
  get state(): string {
    return this.mandatoryValue('edc', 'state');
  }
}
