import { Addresses, EdcConnectorClientContext } from "../src";
import { Inner } from "../src/inner";
import {
  Class,
  EdcController,
  ResourcesCountController,
  WooooController,
} from "./middleware-utils";

const INNER_SYMBOL = Symbol.for("#inner");
const API_TOKEN_SYMBOL = Symbol.for("#apiToken");
const ADDRESSES_SYMBOL = Symbol.for("#addresses");

class EdcConnectorClientBuilder<T extends Record<string, EdcController> = {}> {
  #instance = new EdcConnectorClient();

  apiToken(apiToken: string): this {
    this.#instance[API_TOKEN_SYMBOL] = apiToken;
    return this;
  }

  managementUrl(managementUrl: string): this {
    this.#instance[ADDRESSES_SYMBOL].management = managementUrl;
    return this;
  }

  defaultUrl(defaultUrl: string): this {
    this.#instance[ADDRESSES_SYMBOL].default = defaultUrl;
    return this;
  }

  protocolUrl(protocolUrl: string): this {
    this.#instance[ADDRESSES_SYMBOL].protocol = protocolUrl;
    return this;
  }

  publicUrl(publicUrl: string): this {
    this.#instance[ADDRESSES_SYMBOL].public = publicUrl;
    return this;
  }

  controlUrl(controlUrl: string): this {
    this.#instance[ADDRESSES_SYMBOL].control = controlUrl;
    return this;
  }

  use<K extends string, D extends EdcController>(
    property: K,
    Domain: Class<D, [Inner, EdcConnectorClientContext]>,
  ): EdcConnectorClientBuilder<T & Record<K, D>> {
    const ThisClassProto = Object.getPrototypeOf(this.#instance);

    class DomainClass extends EdcConnectorClient {
      get [property]() {
        const context = new EdcConnectorClientContext(
          this[API_TOKEN_SYMBOL],
          this[ADDRESSES_SYMBOL],
        );
        return new Domain(this[INNER_SYMBOL], context);
      }
    }

    const domain = new DomainClass();
    const DomainClassProto = Object.getPrototypeOf(domain);

    class EdcConnectorClientExtended {
      constructor() {
        Object.defineProperties(
          Object.getPrototypeOf(this),
          Object.entries(Object.getOwnPropertyDescriptors(ThisClassProto))
            .concat(
              Object.entries(
                Object.getOwnPropertyDescriptors(DomainClassProto),
              ),
            )
            .filter(([property, _]) => property !== "constructor")
            .reduce(
              (result, [property, value]) => ({ ...result, [property]: value }),
              {},
            ),
        );
      }
    }

    const extended = new EdcConnectorClientExtended();

    this.#instance = Object.assign(extended, this.#instance, domain);

    return this as any;
  }

  build(): EdcConnectorClient & T {
    return this.#instance as any;
  }
}

class EdcConnectorClient {
  [ADDRESSES_SYMBOL]: Addresses = {};

  [API_TOKEN_SYMBOL]: string | undefined;
  [INNER_SYMBOL] = new Inner();

  get addresses() {
    return this[ADDRESSES_SYMBOL];
  }

  createContext(
    token: string,
    addresses: Addresses,
  ): EdcConnectorClientContext {
    return new EdcConnectorClientContext(token, addresses);
  }

  static Builder = EdcConnectorClientBuilder;
}

describe("EdcConnectorClient#use", () => {
  it("use middlewares", async () => {
    const client = new EdcConnectorClient.Builder()
      .use("resourcesCount", ResourcesCountController)
      .use("woooo", WooooController)
      .build();

    await expect(client.resourcesCount.active()).resolves.toEqual({
      active: true,
    });
    await expect(client.woooo.woooo()).resolves.toEqual({ active: false });
  });
});
