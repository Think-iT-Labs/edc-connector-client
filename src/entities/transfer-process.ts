import { DataAddress } from "./data-address";
import { JsonLdId, JsonLdObject } from "./jsonld";

export class TransferProcess extends JsonLdId {

  get correlationId(): string {
    return this.mandatoryValue('edc', 'correlationId');
  }

  get type(): string {
    return this.mandatoryValue('edc', 'type');
  }

  get state(): string {
    return this.mandatoryValue('edc', 'state');
  }

  get createdAt(): number {
    return this.mandatoryValue('edc', 'createdAt');
  }

  get assetId(): string {
    return this.mandatoryValue('edc', 'assetId');
  }

  get connectorId(): string {
    return this.mandatoryValue('edc', 'connectorId');
  }

  get contractId(): string {
    return this.mandatoryValue('edc', 'contractId');
  }

  get errorDetail(): string | undefined {
    return this.optionalValue('edc', 'errorDetail');
  }

  get dataDestination(): JsonLdObject {
    return this.nested('edc', 'dataDestination');
  }

  get privateProperties(): JsonLdObject {
    return this.nested('edc', 'privateProperties');
  }

}

export class TransferProcessState extends JsonLdObject {
  get state(): string {
    return this.mandatoryValue('edc', 'state');
  }
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
  COMPLETING = "COMPLETING",
  COMPLETED = "COMPLETED",
  TERMINATING = "TERMINATING",
  TERMINATED = "TERMINATED",
  DEPROVISIONING = "DEPROVISIONING",
  DEPROVISIONING_REQUESTED = "DEPROVISIONING_REQUESTED",
  DEPROVISIONED = "DEPROVISIONED",
}

export interface TransferProcessInput {
  assetId: string;
  connectorAddress: string;
  connectorId: string;
  contractId: string;
  dataDestination: DataAddress;
  id?: string;
  properties?: Record<string, string>;
}

export interface EndpointDataReference {
  id: string;
  endpoint: string;
  contractId: string;
  authKey: string;
  authCode: string;
  properties?: Record<string, string>;
}
