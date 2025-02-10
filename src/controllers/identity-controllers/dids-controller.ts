import { EdcConnectorClientContext } from "../../context";
import { DIDDocument } from "../../entities/DID";
import { Inner } from "../../inner";

export class DIDsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  static readonly BASE_PATH = "/v1alpha/dids";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<DIDDocument[]>(actualContext.identity, {
      path: DIDsController.BASE_PATH,
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }
}
