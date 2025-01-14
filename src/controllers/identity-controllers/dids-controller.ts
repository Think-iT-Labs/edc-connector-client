import { EdcConnectorClientContext } from "../../context";
import { DIDDocument } from "../../entities/DID";
import { Inner } from "../../inner";

export class DIDsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;

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
      path: "/v1alpha/dids",
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }
}
