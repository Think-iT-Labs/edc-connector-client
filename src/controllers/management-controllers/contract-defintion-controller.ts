import { EdcConnectorClientContext } from "../../context";
import {
  ContractDefinition,
  ContractDefinitionInput,
  expand,
  expandArray,
  IdResponse,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class ContractDefinitionController extends ManagementBaseController {
  protected readonly resourcePath = "contractdefinitions";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async create(
    input: ContractDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.getBasePath(actualContext),
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          ...input,
          "@context": this.getContextUrl(actualContext),
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    contractDefinitionId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${contractDefinitionId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    contractDefinitionId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractDefinition> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${contractDefinitionId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new ContractDefinition()));
  }

  async queryAll(
    query: QuerySpec = { "@type": "QuerySpec" },
    context?: EdcConnectorClientContext,
  ): Promise<ContractDefinition[]> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body:
          Object.keys(query).length === 0
            ? null
            : {
              ...query,
              "@context": this.getContextUrl(actualContext),
            },
      })
      .then((body) => expandArray(body, () => new ContractDefinition()));
  }

  async update(
    input: ContractDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: this.getBasePath(actualContext),
      method: "PUT",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": this.getContextUrl(actualContext),
      },
    });
  }
}
