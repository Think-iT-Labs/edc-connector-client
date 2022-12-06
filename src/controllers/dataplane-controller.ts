import { Dataplane, DataplaneInput } from "../entities";
import { EdcConnectorClientContext } from "../context";
import { Inner } from "../inner";

export class DataplaneController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async registerDataplane(
    context: EdcConnectorClientContext,
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
    context: EdcConnectorClientContext,
  ): Promise<Dataplane[]> {
    return this.#inner.request(context.dataplane, {
      path: "/dataplane/instances",
      method: "GET",
      apiToken: context.apiToken,
    });
  }
}
