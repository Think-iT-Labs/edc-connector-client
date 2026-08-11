import { EdcConnectorClientContext } from "../../context";
import {
  IdResponse,
  JSON_LD_DEFAULT_CONTEXT,
  JsonLdService,
  Secret,
} from "../../entities";
import { Inner } from "../../inner";

export class SecretController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #jsonLdService: JsonLdService;
  #basePath = "/v3/secrets";

  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    this.#inner = inner;
    this.#context = context;
    this.#jsonLdService = jsonLdService;
  }

  async create(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    const body = await this.#jsonLdService.compact({
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT,
    });

    return this.#inner.request(actualContext.management, {
      path: this.#basePath,
      method: "POST",
      authorization: actualContext.authorization,
      body,
    });
  }

  async get(id: string, context?: EdcConnectorClientContext): Promise<Secret> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/${id}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => this.#jsonLdService.expand(body, () => new Secret()));
  }

  async update(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    const body = await this.#jsonLdService.compact({
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT,
    });

    return this.#inner.request(actualContext.management, {
      path: this.#basePath,
      method: "PUT",
      authorization: actualContext.authorization,
      body,
    });
  }

  async delete(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `${this.#basePath}/${id}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }
}
