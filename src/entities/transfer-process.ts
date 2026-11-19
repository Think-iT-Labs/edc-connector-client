import { DataplaneMetadata, DataplaneMetadataInput } from "./asset";
import { CallbackAddress } from "./callback-address";
import { DataAddress } from "./data-address";
import { JsonLdIdNode, JsonLdNode } from "./jsonld";

export interface TransferProcess extends JsonLdIdNode {
  type: "CONSUMER" | "PROVIDER";
  state: string;
  stateTimestamp: number;
  createdAt?: number;
  correlationId?: string;
  assetId?: string;
  contractId?: string;
  transferType?: string;
  errorDetail?: string;
  dataDestination?: DataAddress;
  callbackAddresses?: CallbackAddress[];
  dataplaneMetadata?: DataplaneMetadata;
  privateProperties?: Record<string, any>;
}

export interface TransferProcessState extends JsonLdNode {
  state: string;
}

export enum TransferProcessStates {
  INITIAL = "INITIAL",
  PROVISIONING = "PROVISIONING",
  PROVISIONING_REQUESTED = "PROVISIONING_REQUESTED",
  PROVISIONED = "PROVISIONED",
  REQUESTING = "REQUESTING",
  REQUESTED = "REQUESTED",
  STARTING = "STARTING",
  STARTED = "STARTED",
  SUSPENDING = "SUSPENDING",
  SUSPENDED = "SUSPENDED",
  RESUMING = "RESUMING",
  RESUMING_REQUESTED = "RESUMING_REQUESTED",
  RESUMED = "RESUMED",
  COMPLETING = "COMPLETING",
  COMPLETED = "COMPLETED",
  TERMINATING = "TERMINATING",
  TERMINATED = "TERMINATED",
  DEPROVISIONING = "DEPROVISIONING",
  DEPROVISIONING_REQUESTED = "DEPROVISIONING_REQUESTED",
  DEPROVISIONED = "DEPROVISIONED",
}

export interface TransferProcessInput {
  /** @deprecated since 0.8.0: not required by the APIs anymore */
  assetId?: string;
  counterPartyAddress: string;
  protocol?: string;
  profile?: string;
  contractId: string;
  transferType: string;
  id?: string;
  callbackAddresses?: CallbackAddress[];
  dataplaneMetadata?: DataplaneMetadataInput;
  privateProperties?: Record<string, string>;
}

export interface EndpointDataReference {
  id: string;
  endpoint: string;
  contractId: string;
  authKey: string;
  authCode: string;
  properties?: Record<string, string>;
}
