import { DataplaneMetadata } from "./asset";
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

  get stateTimestamp(): number {
    return this.mandatoryValue('edc', 'stateTimestamp');
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

  get transferType(): string | undefined {
    return this.optionalValue('edc', 'transferType');
  }

  get errorDetail(): string | undefined {
    return this.optionalValue('edc', 'errorDetail');
  }

  get dataDestination(): JsonLdObject {
    return this.nested('edc', 'dataDestination');
  }

  get callbackAddresses(): JsonLdObject[] {
    return this.array('edc', 'callbackAddresses');
  }

  get dataplaneMetadata(): DataplaneMetadata | undefined {
    return this.nestedOf(
      () => new DataplaneMetadata(),
      'edc',
      'dataplaneMetadata',
    );
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
  counterPartyId: string;
  protocol?: string;
  contractId: string;
  dataDestination?: DataAddress;
  transferType: string;
  id?: string;
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
