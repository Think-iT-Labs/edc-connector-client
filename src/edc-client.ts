import { EdcClientContext } from "./context";
import { DataController, DataplaneController } from "./controllers";
import { Addresses } from "./entities";
import { Inner } from "./inner";

export class EdcClient {
  readonly data: DataController;
  readonly dataplane: DataplaneController;

  constructor() {
    const inner = new Inner();

    this.data = new DataController(inner);
    this.dataplane = new DataplaneController(inner);
  }

  createContext(token: string, addresses: Addresses): EdcClientContext {
    return new EdcClientContext(token, addresses);
  }
}
