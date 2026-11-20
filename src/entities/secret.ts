import { JsonLdNode } from "./jsonld";
import { withLegacyAccessors } from "./jsonld/legacy-accessors";

export interface Secret extends JsonLdNode {
  value: string;
  /** @deprecated since 0.12.0: use `["@id"]` */
  readonly id?: string;
}

export class SecretBuilder {
  instance: Secret = { "@type": "Secret", value: "" };

  raw(data: any): SecretBuilder {
    this.instance = { ...this.instance, ...data };
    return this;
  }

  id(id: string): SecretBuilder {
    this.instance["@id"] = id;
    return this;
  }

  value(value: string): SecretBuilder {
    this.instance.value = value;
    return this;
  }

  build(): Secret {
    return withLegacyAccessors(this.instance);
  }
}
