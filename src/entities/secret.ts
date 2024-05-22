import { JsonLdId } from "./jsonld";

export class Secret extends JsonLdId {

  get value(): string {
    return super.mandatoryValue('edc', 'value');
  }

  set value(value: string) {
    super.setValue('edc', 'value', value);
  }

}

export class SecretBuilder {

  instance: Secret = new Secret();

  raw(data: any): SecretBuilder {
    this.instance = Object.assign({}, this.instance, data);
    return this;
  }

  id(id: string): SecretBuilder {
    this.instance.id = id;
    return this;
  }

  value(value: string): SecretBuilder {
    this.instance.setValue('edc', 'value', value);
    return this;
  }

  build(): Secret {
    return this.instance;
  }
}
