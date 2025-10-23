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
const protocolSymbol = Symbol("[#protocol]");

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

  protocol(dataspaceProtocol: string): this {
    this.#instance[protocolSymbol] = dataspaceProtocol;
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
  [protocolSymbol] = "dataspace-protocol-http:2025-1";

  get management() {
    const context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
    );
    return new ManagementController(this[innerSymbol], context);
  }

  get identity() {
    const context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
    );
    return new IdentityController(this[innerSymbol], context);
  }

  get presentation() {
    const context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
    );
    return new PresentationController(this[innerSymbol], context);
  }

  get observability() {
    const context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
    );
    return new ObservabilityController(this[innerSymbol], context);
  }

  get public() {
    const context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
    );
    return new PublicController(this[innerSymbol], context);
  }

  get federatedCatalog() {
    const context = new EdcConnectorClientContext(
      this[apiTokenSymbol],
      this[addressesSymbol],
    );
    return new FederatedCatalogController(this[innerSymbol], context);
  }

  get addresses() {
    return { ...this[addressesSymbol] };
  }

  get protocol() {
    return this[protocolSymbol];
  }

  createContext(
    token: string,
    addresses: Addresses,
    protocol?: string,
  ): EdcConnectorClientContext {
    return new EdcConnectorClientContext(token, addresses, protocol);
  }

  static version(): string {
    return version;
  }

  static Builder = Builder;
}
