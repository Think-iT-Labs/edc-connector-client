import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  ContractDefinition,
  ContractDefinitionInput,
  IdResponse,
  QuerySpec,
  EDC_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class ContractDefinitionController {
  #inner: Inner;
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async create(
    context: EdcConnectorClientContext,
    input: ContractDefinitionInput,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v2/contractdefinitions",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          ...input,
          "@context": this.defaultContextValues,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    context: EdcConnectorClientContext,
    contractDefinitionId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/contractdefinitions/${contractDefinitionId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async get(
    context: EdcConnectorClientContext,
    contractDefinitionId: string,
  ): Promise<ContractDefinition> {
    return this.#inner.request(context.management, {
      path: `/v2/contractdefinitions/${contractDefinitionId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAll(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractDefinition[]> {
    return this.#inner
      .request(context.management, {
        path: "/v2/contractdefinitions/request",
        method: "POST",
        apiToken: context.apiToken,
        body:
          Object.keys(query).length === 0
            ? null
            : {
                ...query,
                "@context": this.defaultContextValues,
              },
      })
      .then((body) => expandArray(body, () => new ContractDefinition()));
  }

  async update(
    context: EdcConnectorClientContext,
    input: ContractDefinitionInput,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: "/v2/contractdefinitions",
      method: "PUT",
      apiToken: context.apiToken,
      body: {
        ...input,
        "@context": this.defaultContextValues,
      },
    });
  }
}
