import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  IdResponse,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class PolicyDefinitionController extends ManagementBaseController {
  protected readonly resourcePath = "policydefinitions";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async create(
    input: PolicyDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    const body = {
      ...input,
      "@context": this.getContextUrl(actualContext),
    };

    return this.inner
      .request(actualContext.management, {
        path: this.getBasePath(actualContext),
        method: "POST",
        apiToken: actualContext.apiToken,
        body: body,
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async update(
    policyId: string,
    input: PolicyDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${policyId}`,
      method: "PUT",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": this.getContextUrl(actualContext),
      },
    });
  }

  async delete(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${policyId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${policyId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new PolicyDefinition()));
  }

  async queryAll(
    query: QuerySpec = { "@type": "QuerySpec" },
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition[]> {
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
      .then((body) => expandArray(body, () => new PolicyDefinition()));
  }
}
