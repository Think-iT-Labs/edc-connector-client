import { Addresses } from "./entities";

export class EdcConnectorClientContext implements Addresses {
  #apiToken: string | undefined;
  #addresses: Addresses;

  constructor(apiToken: string | undefined, addresses: Addresses) {
    this.#apiToken = apiToken;
    this.#addresses = addresses;
  }

  get default(): string {
    return this.getOrError(this.#addresses.default, "default address");
  }

  get identity(): string {
    return this.getOrError(this.#addresses.identity, "identity address");
  }

  get protocol(): string {
    return this.getOrError(this.#addresses.protocol, "protocol address");
  }

  get management(): string {
    return this.getOrError(this.#addresses.management, "management address");
  }

  get control(): string {
    return this.getOrError(this.#addresses.control, "control address");
  }

  get public(): string {
    return this.getOrError(this.#addresses.public, "public address");
  }

  get federatedCatalog(): string {
    return this.getOrError(
      this.#addresses.federatedCatalogUrl,
      "federatedCatalog address",
    );
  }

  get apiToken(): string | undefined {
    return this.#apiToken;
  }

  private getOrError(
    property: string | undefined,
    propertyName: string,
  ): string {
    if (property) {
      return property!;
    } else {
      throw new Error(`'${propertyName}' has not been set on the client`);
    }
  }
}
