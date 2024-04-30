import { JsonLdId } from "./jsonld";

export class Edr extends JsonLdId {

  get transferProcessId(): string {
    return this.mandatoryValue('edc', 'transferProcessId');
  }

  get agreementId(): string {
    return this.mandatoryValue('edc', 'agreementId');
  }

  get contractNegotiationId(): string {
    return this.mandatoryValue('edc', 'contractNegotiationId');
  }

  get assetId(): string {
    return this.mandatoryValue('edc', 'assetId');
  }

  get providerId(): string {
    return this.mandatoryValue('edc', 'providerId');
  }

  get createdAt(): string {
    return this.mandatoryValue('edc', 'createdAt');
  }

}
