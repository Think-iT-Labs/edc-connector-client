import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  ContractDefinition,
  ContractDefinitionInput,
  IdResponse,
  JsonLdService,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class ContractDefinitionController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("contractdefinitions", inner, jsonLdService, context);
  }

  async create(
    input: ContractDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.management.getBasePath(actualContext),
        method: "POST",
        authorization: actualContext.authorization,
        body: {
          ...input,
          "@context": this.management.getContextUrl(actualContext),
        },
      })
      .then((body) => this.jsonLdService.expand(body, () => new IdResponse()));
  }

  async delete(
    contractDefinitionId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${contractDefinitionId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }

  async get(
    contractDefinitionId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractDefinition> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${contractDefinitionId}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expand(body, () => new ContractDefinition()),
      );
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<ContractDefinition[]> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/request`,
        method: "POST",
        authorization: actualContext.authorization,
        body: {
          ...query,
          "@context": this.management.getContextUrl(actualContext),
        },
      })
      .then((body) =>
        this.jsonLdService.expandArray(body, () => new ContractDefinition()),
      );
  }

  async update(
    input: ContractDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "PUT",
      authorization: actualContext.authorization,
      body: {
        ...input,
        "@context": this.management.getContextUrl(actualContext),
      },
    });
  }
}
