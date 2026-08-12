import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  IdResponse,
  JsonLdService,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class PolicyDefinitionController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("policydefinitions", inner, jsonLdService, context);
  }

  async create(
    input: PolicyDefinitionInput,
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

  async update(
    policyId: string,
    input: PolicyDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${policyId}`,
      method: "PUT",
      authorization: actualContext.authorization,
      body: {
        ...input,
        "@context": this.management.getContextUrl(actualContext),
      },
    });
  }

  async delete(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${policyId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }

  async get(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${policyId}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expand(body, () => new PolicyDefinition()),
      );
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition[]> {
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
        this.jsonLdService.expandArray(body, () => new PolicyDefinition()),
      );
  }
}
