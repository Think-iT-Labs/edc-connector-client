import {
  Addresses,
  DEFAULT_IDENTITY_API_VERSION,
  DEFAULT_MANAGEMENT_API_VERSION,
} from "./entities";

export class EdcConnectorClientContext implements Addresses {
  #authorization: Record<string, string> | undefined;
  #addresses: Addresses;
  #protocolVersion: string;
  #managementApiVersion: string;
  #identityApiVersion: string;

  constructor(
    addresses: Addresses,
    protocolVersion = "dataspace-protocol-http:2025-1",
    managementApiVersion = DEFAULT_MANAGEMENT_API_VERSION,
    identityApiVersion = DEFAULT_IDENTITY_API_VERSION,
    authorization?: Record<string, string>,
  ) {
    this.#authorization = authorization;
    this.#addresses = addresses;
    this.#protocolVersion = protocolVersion;
    this.#managementApiVersion = managementApiVersion;
    this.#identityApiVersion = identityApiVersion;
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

  get protocolVersion(): string | undefined {
    return this.#protocolVersion;
  }

  get authorization(): Record<string, string> | undefined {
    return this.#authorization;
  }

  get managementApiVersion(): string {
    return this.#managementApiVersion;
  }

  get identityApiVersion(): string {
    return this.#identityApiVersion;
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
