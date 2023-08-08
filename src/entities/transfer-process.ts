import { DataAddress } from "./data-address";
import { JsonLdId } from "./jsonld";

export class TransferProcess extends JsonLdId {
  createdAt?: number;
  updatedAt?: number;
  type?: string; // TODO(@fdionisi): specialise
  state?: string; // TODO(@fdionisi): specialise
  stateTimestamp?: number;
  errorDetail?: null | string;
  dataRequest?: {
    id: string;
    assetId: string;
    contractId: string;
    connectorId: string;
  };
  dataDestination?: { properties: { type: string } };
}

export class TransferProcessState extends JsonLdId {
  state?: TransferProcessStates;
}

export enum TransferProcessStates {
  FINALIZED = "FINALIZED",
  STARTED = "STARTED",
  REQUESTING = "REQUESTING",
}

export interface TransferProcessInput {
  assetId: string;
  connectorAddress: string;
  connectorId: string;
  contractId: string;
  dataDestination: DataAddress;
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
