import { EdcClientContext } from "../context";
import {
  Asset,
  AssetInput,
  CreateResult,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec,
} from "../entities";
import { Inner } from "../inner";

export class DataController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async createAsset(
    context: EdcClientContext,
    input: AssetInput,
  ): Promise<CreateResult> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/assets",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async deleteAsset(
    context: EdcClientContext,
    assetId: string,
  ): Promise<void> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/assets/${assetId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getAsset(context: EdcClientContext, assetId: string): Promise<Asset> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/assets/${assetId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async listAssets(context: EdcClientContext): Promise<Asset[]> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/assets",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async createPolicy(
    context: EdcClientContext,
    input: PolicyDefinitionInput,
  ): Promise<CreateResult> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/policydefinitions",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async deletePolicy(
    context: EdcClientContext,
    policyId: string,
  ): Promise<void> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/policydefinitions/${policyId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getPolicy(
    context: EdcClientContext,
    policyId: string,
  ): Promise<PolicyDefinition> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/policydefinitions/${policyId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllPolicies(
    context: EdcClientContext,
    query: QuerySpec = {},
  ): Promise<PolicyDefinition[]> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/policydefinitions/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }
}
