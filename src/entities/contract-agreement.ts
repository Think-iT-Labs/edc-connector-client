import { Policy } from "./policy";
import { JsonLdId } from "./jsonld"

export class ContractAgreement extends JsonLdId {

  get policy(): Policy {
    return Object.assign(new Policy(), this.nested('edc', 'policy'));
  };

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
