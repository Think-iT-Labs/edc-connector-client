import { EdcConnectorClientContext } from "./context";
import {
  DataController,
  ObservabilityController,
  PublicController,
} from "./controllers";
import { Addresses } from "./entities";
import { Inner } from "./inner";

import { version } from "../package.json";

export class EdcConnectorClient {
  readonly data: DataController;
  readonly observability: ObservabilityController;
  readonly public: PublicController;

  constructor() {
    const inner = new Inner();

    this.data = new DataController(inner);
    this.observability = new ObservabilityController(inner);
    this.public = new PublicController(inner);
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
}
