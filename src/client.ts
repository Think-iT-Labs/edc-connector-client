import { Class } from "type-fest";
import { version } from "../package.json";
import { EdcConnectorClientContext } from "./context";
import { ObservabilityController, PublicController } from "./controllers";
import { FederatedCatalogController } from "./controllers/federated-catalog-controller";
import { PresentationController } from "./controllers/presentation-controller";
import { EdcController } from "./edc-controller";
import { Addresses } from "./entities";
import { IdentityController } from "./facades/identity";
import { ManagementController } from "./facades/management";
import { Inner } from "./inner";

export type EdcConnectorClientType<T extends Record<string, EdcController>> =
  EdcConnectorClient & T;

const apiTokenSymbol = Symbol("[#apiToken]");
const addressesSymbol = Symbol("[#addressesToken]");
const innerSymbol = Symbol("[#innerToken]");
const protocolVersionSymbol = Symbol("[#protocolVersion]");

class Builder<T extends Record<string, EdcController> = {}> {
  #instance = new EdcConnectorClient();

  apiToken(apiToken: string): this {
    this.#instance[apiTokenSymbol] = apiToken;
    return this;
  }

  managementUrl(managementUrl: string): this {
    this.#instance[addressesSymbol].management = managementUrl;
    return this;
  }

  identityUrl(identityUrl: string): this {
    this.#instance[addressesSymbol].identity = identityUrl;
    return this;
  }

  presentationUrl(presentationUrl: string): this {
    this.#instance[addressesSymbol].presentation = presentationUrl;
    return this;
  }

  defaultUrl(defaultUrl: string): this {
    this.#instance[addressesSymbol].default = defaultUrl;
    return this;
  }

  protocolUrl(protocolUrl: string): this {
    this.#instance[addressesSymbol].protocol = protocolUrl;
    return this;
  }

  publicUrl(publicUrl: string): this {
    this.#instance[addressesSymbol].public = publicUrl;
    return this;
  }

  controlUrl(controlUrl: string): this {
    this.#instance[addressesSymbol].control = controlUrl;
    return this;
  }

  federatedCatalogUrl(federatedCatalogUrl: string): this {
    this.#instance[addressesSymbol].federatedCatalogUrl = federatedCatalogUrl;
    return this;
  }

  protocolVersion(dataspaceProtocol: string): this {
    this.#instance[protocolVersionSymbol] = dataspaceProtocol;
    return this;
  }

  use<K extends string, C extends EdcController>(
    key: K,
    Controller: Class<C>,
  ): Builder<T & Record<K, C>> {
    Object.defineProperty(this.#instance, key, {
      get() {
        return new Controller(
          this[innerSymbol],
          this.createContext(this[apiTokenSymbol], this[addressesSymbol]),
        );
      },
      enumerable: true,
      configurable: false,
    });

    // SAFETY: we use `Object.defineProperty` above to extend the `EdcConnectorClient` instance.
    return this as any;
  }

  build(): EdcConnectorClientType<T> {
    return this.#instance as EdcConnectorClient & T;
  }
}

export class EdcConnectorClient {
  [apiTokenSymbol]: string | undefined;
  [addressesSymbol]: Addresses = {};
  [innerSymbol] = new Inner();
  [protocolVersionSymbol] = "dataspace-protocol-http:2025-1";
  context: EdcConnectorClientContext;

  constructor() {
    this.context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
      this[protocolVersionSymbol],
    );
  }

  get management() {
    return new ManagementController(this[innerSymbol], this.context);
  }

  get identity() {
    return new IdentityController(this[innerSymbol], this.context);
  }

  get presentation() {
    return new PresentationController(this[innerSymbol], this.context);
  }

  get observability() {
    return new ObservabilityController(this[innerSymbol], this.context);
  }

  get public() {
    return new PublicController(this[innerSymbol], this.context);
  }

  get federatedCatalog() {
    return new FederatedCatalogController(this[innerSymbol], this.context);
  }

  get addresses() {
    return { ...this[addressesSymbol] };
  }

  createContext(
    token: string,
    addresses: Addresses,
    protocolVersion?: string,
  ): EdcConnectorClientContext {
    return new EdcConnectorClientContext(token, addresses, protocolVersion);
  }

  static version(): string {
    return version;
  }

  static Builder = Builder;
}
