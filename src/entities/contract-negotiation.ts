import { JsonLdId, JsonLdValue } from "./jsonld";

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
  'https://w3id.org/edc/v0.0.1/ns/contractAgreementId': JsonLdValue<string>[];
  counterPartyAddress?: string;
  errorDetail?: string;
  protocol?: string;
  state?: string;
  type?: "CONSUMER" | "PROVIDER";

  get contractAgreementId(): string {
    return this['https://w3id.org/edc/v0.0.1/ns/contractAgreementId']
      .map(it => Object.assign(new JsonLdValue(), it))[0]
      .value
  }
}

export class ContractNegotiationState {
  'https://w3id.org/edc/v0.0.1/ns/state': JsonLdValue<string>[];

  get state(): string {
    return this['https://w3id.org/edc/v0.0.1/ns/state']
      .map(it => Object.assign(new JsonLdValue(), it))[0]
      .value;
  }
}
