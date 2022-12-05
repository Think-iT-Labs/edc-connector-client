import { EdcClientContext } from "./context";
import {
  DataController,
  DataplaneController,
  ObservabilityController,
  PublicController,
} from "./controllers";
import { Addresses } from "./entities";
import { Inner } from "./inner";

import { version } from "../package.json";

export class EdcClient {
  readonly data: DataController;
  readonly dataplane: DataplaneController;
  readonly observability: ObservabilityController;
  readonly public: PublicController;

  constructor() {
    const inner = new Inner();

    this.data = new DataController(inner);
    this.dataplane = new DataplaneController(inner);
    this.observability = new ObservabilityController(inner);
    this.public = new PublicController(inner);
  }

  createContext(token: string, addresses: Addresses): EdcClientContext {
    return new EdcClientContext(token, addresses);
  }

  static version(): string {
    return version;
  }
}
