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
  #context?: EdcConnectorClientContext;
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async register(
    input: DataplaneInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: "/v2/dataplanes",
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": this.defaultContextValues,
      },
    });
  }

  async list(context?: EdcConnectorClientContext): Promise<Dataplane[]> {
    const actualContext = context || this.#context!;
    
    return this.#inner
      .request(actualContext.management, {
        path: "/v2/dataplanes",
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expandArray(body, () => new Dataplane()));
  }
}
