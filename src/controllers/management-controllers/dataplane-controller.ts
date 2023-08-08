import { EdcConnectorClientContext } from "../../context";
import {
  expandArray,
  Dataplane,
  DataplaneInput,
  EDC_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class DataplaneController {
  #inner: Inner;
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async register(
    context: EdcConnectorClientContext,
    input: DataplaneInput,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: "/v2/dataplanes",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        ...input,
        "@context": this.defaultContextValues,
      },
    });
  }

  async list(context: EdcConnectorClientContext): Promise<Dataplane[]> {
    return this.#inner
      .request(context.management, {
        path: "/v2/dataplanes",
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => expandArray(body, () => new Dataplane()));
  }
}
