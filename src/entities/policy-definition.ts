import { JsonLdId } from "./jsonld";
import { Policy } from "./policy";

export class PolicyDefinition extends JsonLdId {

  get createdAt(): number {
    return this.mandatoryValue("edc", "createdAt");
  }

  get policy(): Policy {
    const policy = this.nested("edc", "policy");
    return Object.assign(new Policy(), policy);
  }

}

export interface PolicyDefinitionInput {
  '@id'?: string;
  id?: string;
  policy: Policy;
}
