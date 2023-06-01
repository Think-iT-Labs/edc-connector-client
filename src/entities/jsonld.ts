export class JsonLdId {
  '@id': string;

  id() {
    return this['@id'];
  }
}

export class JsonLdValue {
  '@value': string;

  value() {
    return this['@value'];
  }
}
