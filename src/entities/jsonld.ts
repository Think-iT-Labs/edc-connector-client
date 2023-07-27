export class JsonLdId {
  '@id': string;

  get id() {
    return this['@id'];
  }
}

export class JsonLdValue<T> {
  '@value': T;

  get value(): T {
    return this['@value'];
  }
}
