import { JsonLdId, JsonLdObject, JsonLdValue } from "./jsonld";

/**
 * Body of a V4 Data Plane Signaling registration request
 * (`PUT /{version}/dataplanes`). Unlike most management payloads this is a
 * plain JSON object, not a JSON-LD document, so it carries no `@context`/`@type`.
 */
export interface DataplaneRegistrationInput {
  dataplaneId: string;
  endpoint: string;
  transferTypes?: string[];
  labels?: string[];
  authorization?: Record<string, unknown>;
}

export class Dataplane extends JsonLdId {

  get url(): string {
    return this.mandatoryValue('edc', 'url');
  }

  get allowedSourceTypes(): String[] {
    return this.arrayOf(() => new JsonLdValue<string>(), 'edc', 'allowedSourceTypes')
      .map(it => it.value);
  }

  get allowedDestTypes(): String[] {
    return this.arrayOf(() => new JsonLdValue<string>(), 'edc', 'allowedDestTypes')
      .map(it => it.value);
  }

  get allowedTransferTypes(): String[] {
    return this.arrayOf(() => new JsonLdValue<string>(), 'edc', 'allowedTransferTypes')
      .map(it => it.value);
  }

  get properties(): JsonLdObject {
    return this.nested('edc', 'properties');
  }

}
