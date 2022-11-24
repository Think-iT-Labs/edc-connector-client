import { Dataplane, DataplaneInput, SelectorRequest } from "../entities";
import { EdcClientContext } from "../context";
import { Inner } from "../inner";

export class DataplaneController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async registerDataplane(
    context: EdcClientContext,
    input: DataplaneInput,
  ): Promise<void> {
    return this.#inner.request(context.dataplane, {
      path: "/dataplane/instances",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async listDataplanes(
    context: EdcClientContext,
  ): Promise<Dataplane[]> {
    return this.#inner.request(context.dataplane, {
      path: "/dataplane/instances",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async select(
    context: EdcClientContext,
    input: SelectorRequest,
  ): Promise<Dataplane> {
    return this.#inner.request(context.dataplane, {
      path: "/dataplane/instances/select",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }
}
