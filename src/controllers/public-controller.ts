import { EdcClientContext } from "../context";
import { Inner } from "../inner";

export class PublicController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async getTranferedData(
    context: EdcClientContext,
    headers: Record<string, string | undefined>,
  ): Promise<ReadableStream<Uint8Array>> {
    return this.#inner.stream(context.public, {
      path: "/public",
      method: "GET",
      headers,
    });
  }
}
