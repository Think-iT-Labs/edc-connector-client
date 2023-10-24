import { EDC_CONTEXT } from "./context";
import jsonld from "jsonld";

export async function expand<T extends JsonLdObject>(body: any, newInstance: (() => T)): Promise<T> {
  const expanded = await jsonld.expand(body);
  return Object.assign(newInstance(), expanded[0]);
};

export async function expandArray<T extends JsonLdObject>(body: any, newInstance: (() => T)): Promise<T[]> {
  const expanded = await jsonld.expand(body);
  return (expanded as Array<any>)
    .map(element => Object.assign(newInstance(), element));
}

export class JsonLdObject {

  [propertyName: string]: any;

  mandatoryValue<T>(prefix: string, name: string): T {
    return this.optionalValue(prefix, name)!;
  }

  optionalValue<T>(prefix: string, name: string): T | undefined {
    var namespace = this.getNamespaceUrl(prefix);
    return (this[`${namespace}${name}`] as JsonLdValue<T>[])
      ?.map(it => Object.assign(new JsonLdValue(), it))
      ?.at(0)?.value;
  }

  nestedOf<T extends Object>(newInstance: (() => T), prefix: string, name: string): T | undefined {
    var namespace = this.getNamespaceUrl(prefix);
    return (this[`${namespace}${name}`] as JsonLdObject[])
      ?.map(it => Object.assign(newInstance(), it))
      ?.at(0)
      ?? undefined;
  }

  nested(prefix: string, name: string): JsonLdObject {
    return this.nestedOf(() => new JsonLdObject(), prefix, name)
      ?? new JsonLdObject();
  }

  arrayOf<T extends Object>(newInstance: (() => T), prefix: string, name: string): T[] {
    var namespace = this.getNamespaceUrl(prefix);
    return (this[`${namespace}${name}`] as T[])
      .map(element => Object.assign(newInstance(), element));
  }


  array(prefix: string, name: string): JsonLdObject[] {
    return this.arrayOf(() => new JsonLdObject(), prefix, name);
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

}

export class JsonLdValue<T> {
  '@value': T;

  get value(): T {
    return this['@value'];
  }
}
