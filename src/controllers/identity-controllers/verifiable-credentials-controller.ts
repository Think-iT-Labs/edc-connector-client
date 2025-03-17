import { Inner } from "../../inner";
import { EdcConnectorClientContext } from "../../context";
import { VerifiableCredentialsResource } from "../../entities/verifiable-credentials";

export class VerifiableCredentialsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  static readonly BASE_PATH = "/v1alpha/credentials";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<VerifiableCredentialsResource[]>(
      actualContext.identity,
      {
        path: VerifiableCredentialsController.BASE_PATH,
        method: "GET",
        apiToken: actualContext.apiToken,
        query,
      },
    );
  }
}
