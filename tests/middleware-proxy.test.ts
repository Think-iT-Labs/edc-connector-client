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
const CONTROLLERS_SYMBOL = Symbol.for("#controllers");

class EdcConnectorClient<
  R extends Record<
    string,
    Class<EdcController, [Inner, EdcConnectorClientContext]>
  > = {},
> {
  [CONTROLLERS_SYMBOL]: R = {} as any;
  [API_TOKEN_SYMBOL]: string | undefined;
  [ADDRESSES_SYMBOL]: Addresses = {};
  [INNER_SYMBOL] = new Inner();

  get addresses() {
    return this[ADDRESSES_SYMBOL];
  }

  #get(key: string): EdcController {
    if (!(key in this[CONTROLLERS_SYMBOL])) {
      throw new Error("asd");
    }

    const Controller = this[CONTROLLERS_SYMBOL][key];
    const context = new EdcConnectorClientContext(
      this[API_TOKEN_SYMBOL],
      this[ADDRESSES_SYMBOL],
    );

    return new Controller(this[INNER_SYMBOL], context);
  }

  static Builder = class Builder<
    R extends Record<string, Class<EdcController>> = {},
  > {
    #instance: EdcConnectorClient<R> = new EdcConnectorClient();

    use<K extends string, T extends EdcController>(
      key: K,
      controller: Class<T>,
    ): Builder<R & Record<K, T>> {
      this.#instance[CONTROLLERS_SYMBOL] = {
        ...this.#instance[CONTROLLERS_SYMBOL],
        [key]: controller,
      };

      return this as any;
    }

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

    build(): R {
      return new Proxy(this.#instance, {
        get(target, p) {
          return target.#get(p.toString());
        },
      }) as any;
    }
  };
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
