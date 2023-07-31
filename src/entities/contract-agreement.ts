import { Policy } from "./policy";
import { JsonLdId } from "./jsonld"

export class ContractAgreement extends JsonLdId {

  policy?: Policy;

  get assetId(): string {
    return this.mandatoryValue('edc', 'assetId');
  }

  get providerId(): string {
    return this.mandatoryValue('edc', 'providerId');
  }

  get consumerId(): string {
    return this.mandatoryValue('edc', 'providerId');
  }

  get contractSigningDate(): number {
    return this.mandatoryValue('edc', 'providerId');
  }

}
