import { EDC_CONTEXT } from "./context";

export class JsonLdObject {

  [propertyName: string]: any;
  /*
   * this _compacted field is a workaround for a bug existing in the json-ld
   * which causes the EDC offer ids to be "truncated". For further info, take a
   * look at https://github.com/digitalbazaar/jsonld.js/issues/523
   * Once that issue will be fixed, we can get rid of the _compacted and all
   * its usages.
   */
  _compacted: any;

  mandatoryValue<T>(prefix: string, name: string): T {
    return this.optionalValue(prefix, name)!;
  }

  optionalValue<T>(prefix: string, name: string): T | undefined {
    var namespace = this.getNamespaceUrl(prefix);
    if (this._compacted) {
      const key = `${prefix}:${name}`;
      return this._compacted[key]
    }

    return (this[`${namespace}${name}`] as JsonLdValue<T>[])
      ?.map(it => Object.assign(new JsonLdValue(), it))
      ?.at(0)?.value;
  }

  arrayOf<T extends Object>(newInstance: (() => T), prefix: string, name: string): T[] {
    var namespace = this.getNamespaceUrl(prefix);
    return (this[`${namespace}${name}`] as T[])
      .map((element, index) => {
        const instance = Object.assign(newInstance(), element);
        const jsonLd = instance as any as JsonLdObject;
        const object = this._compacted[`${prefix}:${name}`]
        jsonLd._compacted = Array.isArray(object) ? object[index] : object;
        return instance;
      });
  }

  private getNamespaceUrl(prefix: string): string {
    switch (prefix) {
      case 'edc': return EDC_CONTEXT;
      case 'odrl': return 'http://www.w3.org/ns/odrl/2/';
      case 'dcat': return 'https://www.w3.org/ns/dcat/';
      default: throw new Error(`JSON-LD context ${prefix} not supported`);
    }
  }
}

export class JsonLdId extends JsonLdObject {
  '@id': string;

  get id() {
    if (this._compacted) {
      return this._compacted['@id'];
    } else {
      return this['@id'];
    }
  }
}

export class JsonLdValue<T> {
  '@value': T;

  get value(): T {
    return this['@value'];
  }
}
