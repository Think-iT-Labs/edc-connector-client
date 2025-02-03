import { EdcConnectorClientContext } from "../../context";
import { KeyPair } from "../../entities/keypairs";
import { Inner } from "../../inner";

export class KeyPairsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  static readonly BASE_PATH = "/v1alpha/keypairs";

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
      path: KeyPairsController.BASE_PATH,
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }
}
