import { EDC_CONTEXT } from "./context";
import jsonld from "jsonld";

export async function expand<T extends JsonLdObject>(body: any, newInstance: (() => T)): Promise<T> {
  const expanded = await jsonld.expand(body);
  var instance = Object.assign(newInstance(), expanded[0]);
  instance._compacted = body;
  return instance;
};

export async function expandArray<T extends JsonLdObject>(body: any, newInstance: (() => T)): Promise<T[]> {
  const expanded = await jsonld.expand(body);
  return (expanded as Array<any>).map((element, index) => {
    var instance = Object.assign(newInstance(), element);
    instance._compacted = body[index];
    return instance;
  });
}

export class JsonLdObject {

  [propertyName: string]: any;
  /*
   * this _compacted field is a workaround for a bug existing in the json-ld
   * which causes the EDC offer ids to be "truncated". For further info, take a
   * look at https://github.com/digitalbazaar/jsonld.js/issues/523
   * Once that issue will be fixed, we can get rid of the _compacted and all
   * its usages.
   *
   * Why is this needed: "compacted" is the json-ld representation of the object
   * we are receiving from the connector, we are keeping it next to the expanded
   * representation (that is, the content of this JsonLdObject object), getting
   * the data out of it, if it is valued.
   */
  set _compacted(_compacted: any) {
    this.__compacted = _compacted;
  }

  get _compacted() {
    return this.__compacted;
  }

  mandatoryValue<T>(prefix: string, name: string): T {
    return this.optionalValue(prefix, name)!;
  }

  optionalValue<T>(prefix: string, name: string): T | undefined {
    if (this._compacted) {
      const key = `${prefix}:${name}`;
      return this._compacted[key]
    }

    var namespace = this.getNamespaceUrl(prefix);
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
    return this['@id'];
  }

  set id(id: string) {
    this['@id'] = id;
  }

  set _compacted(compacted: any) {
    this.__compacted = compacted;
    if (compacted) {
      this['@id'] = compacted['@id'];
    }
  }

  get _compacted() {
    return this.__compacted;
  }

}

export class JsonLdValue<T> {
  '@value': T;

  get value(): T {
    return this['@value'];
  }
}
