import { EdcConnectorClientContext } from "../../context";
import { KeyPair } from "../../entities/keypairs";
import { Inner } from "../../inner";

export class KeyPairsController {
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

    return this.#inner.request<KeyPair[]>(actualContext.identity, {
      path: "/v1alpha/keypairs",
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }
}
