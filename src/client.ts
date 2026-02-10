import { Class } from "type-fest";
import { version } from "../package.json";
import { EdcConnectorClientContext } from "./context";
import { ObservabilityController } from "./controllers";
import { FederatedCatalogController } from "./controllers/federated-catalog-controller";
import { PresentationController } from "./controllers/presentation-controller";
import { EdcController } from "./edc-controller";
import { Addresses } from "./entities";
import { IdentityController } from "./facades/identity";
import { ManagementController } from "./facades/management";
import { Inner } from "./inner";

export type EdcConnectorClientType<T extends Record<string, EdcController>> =
  EdcConnectorClient & T;

export type ContextInput = {
  token?: string;
  addresses: Addresses;
  protocolVersion?: string;
};

const apiTokenSymbol = Symbol("[#apiToken]");
const addressesSymbol = Symbol("[#addressesToken]");
const innerSymbol = Symbol("[#innerToken]");
const protocolVersionSymbol = Symbol("[#protocolVersion]");

class Builder<T extends Record<string, EdcController> = {}> {
  #instance = new EdcConnectorClient();
  [apiTokenSymbol]?: string;
  [addressesSymbol]: Addresses = {};
  [protocolVersionSymbol]?: string;

  apiToken(apiToken: string): this {
    this[apiTokenSymbol] = apiToken;
    return this;
  }

  managementUrl(managementUrl: string): this {
    this[addressesSymbol].management = managementUrl;
    return this;
  }

  identityUrl(identityUrl: string): this {
    this[addressesSymbol].identity = identityUrl;
    return this;
  }

  presentationUrl(presentationUrl: string): this {
    this[addressesSymbol].presentation = presentationUrl;
    return this;
  }

  defaultUrl(defaultUrl: string): this {
    this[addressesSymbol].default = defaultUrl;
    return this;
  }

  protocolUrl(protocolUrl: string): this {
    this[addressesSymbol].protocol = protocolUrl;
    return this;
  }

  controlUrl(controlUrl: string): this {
    this[addressesSymbol].control = controlUrl;
    return this;
  }

  federatedCatalogUrl(federatedCatalogUrl: string): this {
    this[addressesSymbol].federatedCatalogUrl = federatedCatalogUrl;
    return this;
  }

  protocolVersion(dataspaceProtocol: string): this {
    this[protocolVersionSymbol] = dataspaceProtocol;
    return this;
  }

  use<K extends string, C extends EdcController>(
    key: K,
    Controller: Class<C>,
  ): Builder<T & Record<K, C>> {
    Object.defineProperty(this.#instance, key, {
      get() {
        return new Controller(this[innerSymbol], this.context);
      },
      enumerable: true,
      configurable: false,
    });

    // SAFETY: we use `Object.defineProperty` above to extend the `EdcConnectorClient` instance.
    return this as any;
  }

  build(): EdcConnectorClientType<T> {
    this.#instance.context = EdcConnectorClient.createContext({
      token: this[apiTokenSymbol],
      addresses: this[addressesSymbol],
      protocolVersion: this[protocolVersionSymbol],
    });

    return this.#instance as EdcConnectorClient & T;
  }
}

export class EdcConnectorClient {
  [innerSymbol] = new Inner();
  context: EdcConnectorClientContext;

  constructor(input: ContextInput = { addresses: {} }) {
    this.context = EdcConnectorClient.createContext(input);
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

  get federatedCatalog() {
    return new FederatedCatalogController(this[innerSymbol], this.context);
  }

  get addresses(): Addresses {
    return this.context.addresses;
  }

  /**
   * @deprecated
   */
  createContext(
    token: string,
    addresses: Addresses,
    protocolVersion?: string,
  ): EdcConnectorClientContext {
    return new EdcConnectorClientContext(token, addresses, protocolVersion);
  }

  static createContext(
    { token, addresses, protocolVersion }: ContextInput = { addresses: {} },
  ): EdcConnectorClientContext {
    return new EdcConnectorClientContext(token, addresses, protocolVersion);
  }

  static version(): string {
    return version;
  }

  static Builder = Builder;
}
