import { JsonLdId } from "./jsonld";

export class IdResponse extends JsonLdId {

  get createdAt(): number {
    return this.mandatoryValue('edc', 'createdAt');
  }
}
