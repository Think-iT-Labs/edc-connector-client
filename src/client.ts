import { EdcConnectorClientContext } from "./context";
import { ObservabilityController, PublicController } from "./controllers";
import { Addresses } from "./entities";
import { Inner } from "./inner";

import { version } from "../package.json";
import { ManagementController } from "./facades/management";

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

  static Builder = class Builder {
    #instance = new EdcConnectorClient();

    apiToken(apiToken: string): Builder {
      this.#instance.#apiToken = apiToken;
      return this;
    }

    managementUrl(managementUrl: string): Builder {
      this.#instance.#addresses.management = managementUrl;
      return this;
    }

    defaultUrl(defaultUrl: string): Builder {
      this.#instance.#addresses.default = defaultUrl;
      return this;
    }

    protocolUrl(protocolUrl: string): Builder {
      this.#instance.#addresses.protocol = protocolUrl;
      return this;
    }

    publicUrl(publicUrl: string): Builder {
      this.#instance.#addresses.public = publicUrl;
      return this;
    }

    controlUrl(controlUrl: string): Builder {
      this.#instance.#addresses.control = controlUrl;
      return this;
    }

    build(): EdcConnectorClient {
      return this.#instance;
    }
  };
}
