import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  Dataplane,
  DataplaneInput,
  IdResponse,
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
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: "/v2/dataplanes",
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": this.defaultContextValues,
      },
    })
    .then((body) => expand(body, () => new IdResponse()));
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
