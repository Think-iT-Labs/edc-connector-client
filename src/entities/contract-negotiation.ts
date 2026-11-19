import { CallbackAddress } from "./callback-address";
import { JsonLdIdNode, JsonLdNode } from "./jsonld";
import { PolicyBody } from "./policy";

export interface ContractNegotiationRequest {
  "@type"?: "ContractRequest";
  "@id"?: string;
  id?: string;
  counterPartyAddress: string;
  protocol?: string;
  profile?: string;
  policy: PolicyBody;
  callbackAddresses?: CallbackAddress[];
}

export interface ContractNegotiation extends JsonLdIdNode {
  type: "CONSUMER" | "PROVIDER";
  state: string;
  stateTimestamp?: number;
  protocol?: string;
  profile?: string;
  counterPartyAddress?: string;
  counterPartyId?: string;
  createdAt?: number;
  errorDetail?: string;
  correlationId?: string;
  assetId?: string;
  contractAgreementId?: string;
  callbackAddresses?: CallbackAddress[];
}

export interface ContractNegotiationState extends JsonLdNode {
  state: string;
}
