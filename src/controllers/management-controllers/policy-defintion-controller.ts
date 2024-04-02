import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  IdResponse,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec,
  JSON_LD_DEFAULT_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class PolicyDefinitionController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async create(
    input: PolicyDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    const body = {
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT,
    };

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/policydefinitions",
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
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `/v2/policydefinitions/${policyId}`,
        method: "PUT",
        apiToken: actualContext.apiToken,
        body: {
          ...input,
          "@context": JSON_LD_DEFAULT_CONTEXT,
        },
      })
  }

  async delete(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `/v2/policydefinitions/${policyId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `/v2/policydefinitions/${policyId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new PolicyDefinition()));
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/policydefinitions/request",
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
      .then((body) => expandArray(body, () => new PolicyDefinition()));
  }
}
