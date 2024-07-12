import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  ContractDefinition,
  ContractDefinitionInput,
  IdResponse,
  QuerySpec,
  JSON_LD_DEFAULT_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class ContractDefinitionController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #basePath = "/v3/contractdefinitions";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async create(
    input: ContractDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: this.#basePath,
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          ...input,
          "@context": JSON_LD_DEFAULT_CONTEXT,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    contractDefinitionId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `${this.#basePath}/${contractDefinitionId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    contractDefinitionId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractDefinition> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `${this.#basePath}/${contractDefinitionId}`,
      method: "GET",
      apiToken: actualContext.apiToken,
    })
    .then((body) => expand(body, () => new ContractDefinition()));
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<ContractDefinition[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body:
          Object.keys(query).length === 0
            ? null
            : {
                ...query,
                "@context": JSON_LD_DEFAULT_CONTEXT,
              },
      })
      .then((body) => expandArray(body, () => new ContractDefinition()));
  }

  async update(
    input: ContractDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: this.#basePath,
      method: "PUT",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": JSON_LD_DEFAULT_CONTEXT,
      },
    });
  }
}
