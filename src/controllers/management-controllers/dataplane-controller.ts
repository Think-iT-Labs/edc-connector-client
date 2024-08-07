import { EdcConnectorClientContext } from "../../context";
import {
  expandArray,
  Dataplane,
} from "../../entities";
import { Inner } from "../../inner";

export class DataplaneController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #basePath = "/v3/dataplanes"

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async list(context?: EdcConnectorClientContext): Promise<Dataplane[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: this.#basePath,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expandArray(body, () => new Dataplane()));
  }

}
