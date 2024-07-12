import { EdcConnectorClientContext } from "../../context";
import {
  compact,
  expand,
  IdResponse,
  Secret,
  JSON_LD_DEFAULT_CONTEXT
} from "../../entities";
import { Inner } from "../../inner";

export class SecretController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #basePath = "/v3/secrets";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async create(input: Secret, context?: EdcConnectorClientContext): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    const body = await compact({
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT
    });

    return this.#inner.request(actualContext.management, {
        path: this.#basePath,
        method: "POST",
        apiToken: actualContext.apiToken,
        body
      });
  }

  async get(
    id: string,
    context?: EdcConnectorClientContext,
  ): Promise<Secret> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/${id}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new Secret()));
  }

  async update(input: Secret, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = context || this.#context!;

    const body = await compact({
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT
    });

    return this.#inner.request(actualContext.management, {
      path: this.#basePath,
      method: "PUT",
      apiToken: actualContext.apiToken,
      body,
    });
  }

  async delete(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
        path: `${this.#basePath}/${id}`,
        method: "DELETE",
        apiToken: actualContext.apiToken,
      });
  }

}
