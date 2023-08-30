import { EdcConnectorClientContext } from "../context";
import { Inner } from "../inner";

export class PublicController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async getTransferredData(
    headers: Record<string, string | undefined>,
    context?: EdcConnectorClientContext,
  ): Promise<Response> {
    const actualContext = context || this.#context!;

    return this.#inner.stream(actualContext.public, {
      path: "/",
      method: "GET",
      headers,
    });
  }
}
