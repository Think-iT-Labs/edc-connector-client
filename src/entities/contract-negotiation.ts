import { JsonLdId, JsonLdValue } from "./jsonld";

export interface ContractNegotiationRequest {
  connectorAddress: string;
  connectorId: string;
  offer: {
    offerId: string;
    assetId: string;
    policy: any;
  };
  protocol: string;
}

export class ContractNegotiation extends JsonLdId {
  updatedAt?: number;
  createdAt?: number;
  'https://w3id.org/edc/v0.0.1/ns/contractAgreementId': Array<JsonLdValue>
  counterPartyAddress?: string;
  errorDetail?: string;
  protocol?: string;
  state?: string;
  type?: "CONSUMER" | "PROVIDER";

  contractAgreementId(): string {
    return this['https://w3id.org/edc/v0.0.1/ns/contractAgreementId']
      .map(it => Object.assign(new JsonLdValue(), it))[0]
      .value()
  }
}

export class ContractNegotiationState {
  'https://w3id.org/edc/v0.0.1/ns/state': Array<JsonLdValue>;

  state(): string {
    return this['https://w3id.org/edc/v0.0.1/ns/state']
      .map(it => Object.assign(new JsonLdValue(), it))[0]
      .value();
  }
}
