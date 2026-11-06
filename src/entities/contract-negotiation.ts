import { CallbackAddress } from "./callback-address";
import { JsonLdId, JsonLdObject } from "./jsonld";
import { Policy } from "./policy";

export interface ContractNegotiationRequest {
  "@type"?: "ContractRequest";
  "@id"?: string;
  id?: string;
  counterPartyAddress: string;
  protocol?: string;
  profile?: string;
  policy: Policy;
  callbackAddresses?: CallbackAddress[];
}

export class ContractNegotiation extends JsonLdId {
  get type(): "CONSUMER" | "PROVIDER" {
    return this.mandatoryValue("edc", "type");
  }

  get protocol(): string | undefined {
    return this.optionalValue("edc", "protocol");
  }

  get profile(): string | undefined {
    return this.optionalValue("edc", "profile");
  }

  get counterPartyAddress(): string | undefined {
    return this.optionalValue("edc", "counterPartyAddress");
  }

  get counterPartyId(): string | undefined {
    return this.optionalValue("edc", "counterPartyId");
  }

  get state(): string {
    return this.mandatoryValue("edc", "state");
  }

  get createdAt(): number | undefined {
    return this.optionalValue("edc", "createdAt");
  }

  get errorDetail(): string | undefined {
    return this.optionalValue("edc", "errorDetail");
  }

  get contractAgreementId(): string {
    return this.mandatoryValue("edc", "contractAgreementId");
  }

  get callbackAddresses(): JsonLdObject[] {
    return this.array("edc", "callbackAddresses");
  }
}

export class ContractNegotiationState extends JsonLdObject {
  get state(): string {
    return this.mandatoryValue("edc", "state");
  }
}
