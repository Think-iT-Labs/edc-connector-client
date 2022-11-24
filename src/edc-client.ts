import { EdcClientContext } from "./context";
import { Addresses } from "./entities";
import { Inner } from "./inner";

export class EdcClient {
  #inner: Inner;
  constructor() {
    this.#inner = new Inner();

    // TODO(@fdionisi): remove as soon as controllers are implemented
    this.#inner;
  }

  createContext(token: string, addresses: Addresses): EdcClientContext {
    return new EdcClientContext(token, addresses);
  }
}
