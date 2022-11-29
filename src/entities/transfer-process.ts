import { DataAddress } from "./data-address";

export interface TransferProcess {
  createdAt: number;
  updatedAt: number;
  id: string;
  type: string; // TODO(@fdionisi): specialise
  state: string; // TODO(@fdionisi): specialise
  stateTimestamp: number;
  errorDetail: null | string;
  dataRequest: {
    id: string;
    assetId: string;
    contractId: string;
    connectorId: string;
  };
  dataDestination: { properties: { type: string } };
}

export interface TransferProcessInput {
  assetId: string;
  connectorAddress: string;
  connectorId: string;
  contractId: string;
  dataDestination: DataAddress;
  protocol?: string;
  transferType?: TransferType;
  id?: string;
  properties?: Record<string, string>;
  managedResources: boolean;
}

export interface TransferType {
  contentType?: string;
  isFinite?: boolean;
}

export interface TransferProcessResponse {
  id: string;
  endpoint: string;
  contractId: string;
  authKey: string;
  authCode: string;
  properties?: Record<string, string>;
}
