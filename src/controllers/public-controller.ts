import { EdcConnectorClientContext } from "../context";
import { Inner } from "../inner";

export class PublicController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async getTransferredData(
    context: EdcConnectorClientContext,
    headers: Record<string, string | undefined>,
  ): Promise<Response> {
    return this.#inner.stream(context.public, {
      path: "/",
      method: "GET",
      headers,
    });
  }
}
