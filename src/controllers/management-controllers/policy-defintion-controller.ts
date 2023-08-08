import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  IdResponse,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec,
  EDC_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class PolicyDefinitionController {
  #inner: Inner;
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async create(
    context: EdcConnectorClientContext,
    input: PolicyDefinitionInput,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v2/policydefinitions",
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
    policyId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/policydefinitions/${policyId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async get(
    context: EdcConnectorClientContext,
    policyId: string,
  ): Promise<PolicyDefinition> {
    return this.#inner
      .request(context.management, {
        path: `/v2/policydefinitions/${policyId}`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => expand(body, () => new PolicyDefinition()));
  }

  async queryAll(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<PolicyDefinition[]> {
    return this.#inner
      .request(context.management, {
        path: "/v2/policydefinitions/request",
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
      .then((body) => expandArray(body, () => new PolicyDefinition()));
  }
}
