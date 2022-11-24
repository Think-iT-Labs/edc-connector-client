import { EdcClientContext } from "./context";
import { DataController } from "./controllers";
import { Addresses } from "./entities";
import { Inner } from "./inner";

export class EdcClient {
  readonly data: DataController;

  constructor() {
    const inner = new Inner();

    this.data = new DataController(inner);
  }

  createContext(token: string, addresses: Addresses): EdcClientContext {
    return new EdcClientContext(token, addresses);
  }
}
