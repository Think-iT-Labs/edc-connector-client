import { EdcClientContext } from "../context";
import { Inner } from "../inner";

export class PublicController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async getTranferedData(
    context: EdcClientContext,
    headers: Record<string, string>,
  ): Promise<any> {
    return this.#inner.request(context.public, {
      path: "/public",
      method: "GET",
      apiToken: context.apiToken,
      headers: headers,
    });
  }
}
