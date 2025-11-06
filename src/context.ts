import { Addresses } from "./entities";

export class EdcConnectorClientContext implements Addresses {
  #apiToken: string | undefined;
  #addresses: Addresses;
  #protocolVersion: string;

  constructor(
    apiToken: string | undefined,
    addresses: Addresses,
    protocolVersion = "dataspace-protocol-http:2025-1",
  ) {
    this.#apiToken = apiToken;
    this.#addresses = addresses;
    this.#protocolVersion = protocolVersion;
  }

  get default(): string {
    return this.getOrError(this.#addresses.default, "default address");
  }

  get identity(): string {
    return this.getOrError(this.#addresses.identity, "identity address");
  }

  get presentation(): string {
    return this.getOrError(
      this.#addresses.presentation,
      "presentation address",
    );
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

  get protocolVersion(): string | undefined {
    return this.#protocolVersion;
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

  get addresses() {
    return { ...this.#addresses };
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
