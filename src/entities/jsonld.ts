import { EDC_CONTEXT } from "./context";

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

  arrayOf<T extends Object>(newInstance: (() => T), prefix: string, name: string): T[] {
    var namespace = this.getNamespaceUrl(prefix);
    return (this[`${namespace}${name}`] as T[]).map(it =>
      Object.assign(newInstance(), it),
    );
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
}

export class JsonLdValue<T> {
  '@value': T;

  get value(): T {
    return this['@value'];
  }
}
