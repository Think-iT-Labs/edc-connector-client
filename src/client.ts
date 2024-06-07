import { Class } from "type-fest";
import { version } from "../package.json";
import { EdcConnectorClientContext } from "./context";
import { ObservabilityController, PublicController } from "./controllers";
import { EdcController } from "./edc-controller";
import { Addresses } from "./entities";
import { ManagementController } from "./facades/management";
import { Inner } from "./inner";

type EdcControllerClass = Class<
  EdcController,
  [Inner, EdcConnectorClientContext]
>;

export type EdcConnectorClientType<
  T extends Record<string, EdcController>,
> = EdcConnectorClient & T;

export class EdcConnectorClient {
  #apiToken: string | undefined;
  #addresses: Addresses = {};
  #inner = new Inner();

  get management() {
    const context = new EdcConnectorClientContext(
      this.#apiToken,
      this.#addresses,
    );
    return new ManagementController(this.#inner, context);
  }

  get observability() {
    const context = new EdcConnectorClientContext(
      this.#apiToken,
      this.#addresses,
    );
    return new ObservabilityController(this.#inner, context);
  }

  get public() {
    const context = new EdcConnectorClientContext(
      this.#apiToken,
      this.#addresses,
    );
    return new PublicController(this.#inner, context);
  }

  get addresses() {
    return this.#addresses;
  }

  createContext(
    token: string,
    addresses: Addresses,
  ): EdcConnectorClientContext {
    return new EdcConnectorClientContext(token, addresses);
  }

  static version(): string {
    return version;
  }

  static Builder = class Builder<
    Controllers extends Record<
      string,
      EdcControllerClass
    > = {},
  > {
    #instance = new EdcConnectorClient();
    #controllers: Partial<Controllers> = {};

    apiToken(apiToken: string): this {
      this.#instance.#apiToken = apiToken;
      return this;
    }

    managementUrl(managementUrl: string): this {
      this.#instance.#addresses.management = managementUrl;
      return this;
    }

    defaultUrl(defaultUrl: string): this {
      this.#instance.#addresses.default = defaultUrl;
      return this;
    }

    protocolUrl(protocolUrl: string): this {
      this.#instance.#addresses.protocol = protocolUrl;
      return this;
    }

    publicUrl(publicUrl: string): this {
      this.#instance.#addresses.public = publicUrl;
      return this;
    }

    controlUrl(controlUrl: string): this {
      this.#instance.#addresses.control = controlUrl;
      return this;
    }

    use<K extends string, C extends EdcController>(
      key: K,
      controller: EdcControllerClass,
    ): Builder<Controllers & Record<K, C>> {
      const b = new Builder<Controllers & Record<K, C>>();
      b.#instance = this.#instance;

      b.#controllers = {
        ...this.#controllers,
        [key]: controller,
      } as Controllers & Record<K, C>;

      return b;
    }

    build<K extends keyof Controllers>(): EdcConnectorClientType<
      Record<K, InstanceType<Controllers[K]>>
    > {
      for (const key in this.#controllers) {
        if (this.#controllers.hasOwnProperty(key)) {
          const Controller = this.#controllers[key]!;
          Object.defineProperty(this.#instance, key, {
            get: () =>
              new Controller(
                this.#instance.#inner,
                this.#instance.createContext(
                  this.#instance.#apiToken!,
                  this.#instance.#addresses,
                ),
              ),
            enumerable: true,
            configurable: false,
          });
        }
      }

      return this.#instance as
        & EdcConnectorClient
        & { [K in keyof Controllers]: InstanceType<Controllers[K]> };
    }
  };
}
