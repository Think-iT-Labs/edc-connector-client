import { EdcClientContext } from "./context";
import {
  DataController,
  DataplaneController,
  ObservabilityController,
} from "./controllers";
import { Addresses } from "./entities";
import { Inner } from "./inner";

export class EdcClient {
  readonly data: DataController;
  readonly dataplane: DataplaneController;
  readonly observability: ObservabilityController;

  constructor() {
    const inner = new Inner();

    this.data = new DataController(inner);
    this.dataplane = new DataplaneController(inner);
    this.observability = new ObservabilityController(inner);
  }

  createContext(token: string, addresses: Addresses): EdcClientContext {
    return new EdcClientContext(token, addresses);
  }
}
