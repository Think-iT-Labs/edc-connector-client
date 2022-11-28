import { Policy } from "./policy";

export interface ContractNegotiationRequest {
  connectorAddress: string;
  connectorId: string;
  offer: {
    offerId: string;
    assetId: string;
    policy: Policy;
  };
  protocol: string;
}

export interface ContractNegotiation {
  id: string;
  updatedAt: number;
  createdAt: number;
  contractAgreementId?: string;
  counterPartyAddress?: string;
  errorDetail?: string;
  protocol?: string;
  state: string;
  type: "CONSUMER" | "PROVIDER";
}

export interface ContractNegotiationState {
  state: string;
}
