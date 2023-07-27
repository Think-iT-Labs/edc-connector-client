import { JsonLdId, JsonLdValue } from "./jsonld";

export class IdResponse extends JsonLdId {

  'https://w3id.org/edc/v0.0.1/ns/createdAt': JsonLdValue<number>[];

  get createdAt(): number {
    return this['https://w3id.org/edc/v0.0.1/ns/createdAt']
      .map(it => Object.assign(new JsonLdValue(), it))[0]
      .value
  }
}
