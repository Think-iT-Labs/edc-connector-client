import { EdcClientContext } from "../context";
import {
  Asset,
  AssetInput,
  Catalog,
  CatalogRequest,
  ContractDefinition,
  ContractDefinitionInput,
  ContractNegotiation,
  ContractNegotiationRequest,
  ContractNegotiationState,
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

  async createContractDefinition(
    context: EdcClientContext,
    input: ContractDefinitionInput,
  ): Promise<CreateResult> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/contractdefinitions",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async deleteContractDefinition(
    context: EdcClientContext,
    contractDefinitionId: string,
  ): Promise<void> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractdefinitions/${contractDefinitionId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getContractDefinition(
    context: EdcClientContext,
    contractDefinitionId: string,
  ): Promise<ContractDefinition> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractdefinitions/${contractDefinitionId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllContractDefinitions(
    context: EdcClientContext,
    query: QuerySpec = {},
  ): Promise<ContractDefinition[]> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/contractdefinitions/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }

  async requestCatalog(
    context: EdcClientContext,
    input: CatalogRequest,
  ): Promise<Catalog> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/catalog/request",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async initiateContractNegotiation(
    context: EdcClientContext,
    input: ContractNegotiationRequest,
  ): Promise<CreateResult> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/contractnegotiations",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async queryNegotiations(
    context: EdcClientContext,
    query: QuerySpec = {},
  ): Promise<ContractNegotiation[]> {
    return this.#inner.request(context.data, {
      path: "/api/v1/data/contractnegotiations/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }

  async getNegotiation(
    context: EdcClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiation> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractnegotiations/${negotiationId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async getNegotiationState(
    context: EdcClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiationState> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractnegotiations/${negotiationId}/state`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async cancelNegotiation(
    context: EdcClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractnegotiations/${negotiationId}/cancel`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async declineNegotiation(
    context: EdcClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractnegotiations/${negotiationId}/decline`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async getAgreementForNegotiation(
    context: EdcClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiation> {
    return this.#inner.request(context.data, {
      path: `/api/v1/data/contractnegotiations/${negotiationId}/agreement`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }
}
