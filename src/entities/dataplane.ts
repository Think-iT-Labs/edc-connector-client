import { JsonLdId, JsonLdObject, JsonLdValue } from "./jsonld";

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

  get properties(): JsonLdObject {
    return this.nested('edc', 'properties');
  }

}

export type DataplaneInput = Omit<Dataplane, "lastActive" | "turnCount">;
