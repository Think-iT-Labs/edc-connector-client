import { EdcConnectorClientContext } from "../context";
import {
  expand,
  expandArray,
  AssetResponse,
  AssetInput,
  Catalog,
  CatalogRequest,
  ContractAgreement,
  ContractDefinition,
  ContractDefinitionInput,
  ContractNegotiation,
  ContractNegotiationRequest,
  ContractNegotiationState,
  DataAddressProperties,
  Dataplane,
  DataplaneInput,
  IdResponse,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec,
  TransferProcess,
  TransferProcessInput,
  EDC_CONTEXT,
} from "../entities";
import { Inner } from "../inner";

export class ManagementController {
  #inner: Inner;
  protocol: String = "dataspace-protocol-http";
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async registerDataplane(
    context: EdcConnectorClientContext,
    input: DataplaneInput,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: "/v2/dataplanes",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        ...input,
        "@context": this.defaultContextValues,
      },
    });
  }

  async listDataplanes(
    context: EdcConnectorClientContext,
  ): Promise<Dataplane[]> {
    return this.#inner.request(context.management, {
      path: "/v2/dataplanes",
      method: "GET",
      apiToken: context.apiToken,
    })
    .then(body => expandArray(body, () => new Dataplane()));
  }

  async createAsset(
    context: EdcConnectorClientContext,
    input: AssetInput,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v2/assets",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          ...input,
          "@context": this.defaultContextValues,
        },
      })
      .then(body => expand(body, () => new IdResponse()));
  }

  async deleteAsset(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/assets/${assetId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getAsset(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<AssetResponse> {
    return this.#inner.request(context.management, {
      path: `/v2/assets/${assetId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async getAssetDataAddress(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<DataAddressProperties> {
    return this.#inner.request(context.management, {
      path: `/v2/assets/${assetId}/dataaddress`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllAssets(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<AssetResponse[]> {
    return this.#inner.request(context.management, {
      path: "/v2/assets/request",
      method: "POST",
      apiToken: context.apiToken,
      body:
        Object.keys(query).length === 0
          ? null
          : {
              ...query,
              "@context": this.defaultContextValues,
            },
    });
  }

  async createPolicy(
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
      .then(body => expand(body, () => new IdResponse()));
  }

  async deletePolicy(
    context: EdcConnectorClientContext,
    policyId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/policydefinitions/${policyId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getPolicy(
    context: EdcConnectorClientContext,
    policyId: string,
  ): Promise<PolicyDefinition> {
    return this.#inner.request(context.management, {
      path: `/v2/policydefinitions/${policyId}`,
      method: "GET",
      apiToken: context.apiToken,
    })
    .then(body => expand(body, () => new PolicyDefinition()));
  }

  async queryAllPolicies(
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
      .then(body => expandArray(body, () => new PolicyDefinition()));
  }

  async createContractDefinition(
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
      .then(body => expand(body, () => new IdResponse()));
  }

  async deleteContractDefinition(
    context: EdcConnectorClientContext,
    contractDefinitionId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/contractdefinitions/${contractDefinitionId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getContractDefinition(
    context: EdcConnectorClientContext,
    contractDefinitionId: string,
  ): Promise<ContractDefinition> {
    return this.#inner.request(context.management, {
      path: `/v2/contractdefinitions/${contractDefinitionId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllContractDefinitions(
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
      .then(body => expandArray(body, () => new ContractDefinition()));
  }

  async requestCatalog(
    context: EdcConnectorClientContext,
    input: CatalogRequest,
  ): Promise<Catalog> {
    return this.#inner
      .request(context.management, {
        path: "/v2/catalog/request",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          "@context": this.defaultContextValues,
          protocol: this.protocol,
          ...input,
        },
      })
      .then(body => expand(body, () => new Catalog()));
  }

  async initiateContractNegotiation(
    context: EdcConnectorClientContext,
    input: ContractNegotiationRequest,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v2/contractnegotiations",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          protocol: this.protocol,
          "@context": this.defaultContextValues,
          ...input,
        },
      })
      .then(body => expand(body, () => new IdResponse()));
  }

  async queryNegotiations(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractNegotiation[]> {
    return this.#inner.request(context.management, {
      path: "/v2/contractnegotiations/request",
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
    .then(body => expandArray(body, () => new ContractNegotiation()));
  }

  async getNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiation> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractnegotiations/${negotiationId}`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then(body => expand(body, () => new ContractNegotiation()));
  }

  async getNegotiationState(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiationState> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractnegotiations/${negotiationId}/state`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then(body => expand(body, () => new ContractNegotiationState()));
  }

  async cancelNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/contractnegotiations/${negotiationId}/cancel`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async declineNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/contractnegotiations/${negotiationId}/decline`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async getAgreementForNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractAgreement> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractnegotiations/${negotiationId}/agreement`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then(body => expand(body, () => new ContractAgreement()));
  }

  async queryAllAgreements(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractAgreement[]> {
    return this.#inner
      .request(context.management, {
        path: "/v2/contractagreements/request",
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
      .then(body => expandArray(body, () => new ContractAgreement()));
  }

  async getAgreement(
    context: EdcConnectorClientContext,
    agreementId: string,
  ): Promise<ContractAgreement> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractagreements/${agreementId}`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then(body => expand(body, () => new ContractAgreement()));
  }

  async initiateTransfer(
    context: EdcConnectorClientContext,
    input: TransferProcessInput,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v2/transferprocesses",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          "@context": this.defaultContextValues,
          protocol: this.protocol,
          ...input,
        },
      })
      .then(body => expand(body, () => new IdResponse()));
  }

  async queryAllTransferProcesses(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<TransferProcess[]> {
    return this.#inner
      .request(context.management, {
        path: "/v2/transferprocesses/request",
        method: "POST",
        apiToken: context.apiToken,
        body: Object.keys(query).length === 0 ? null : {
          ...query,
          "@context": this.defaultContextValues,
        },
      })
      .then(body => expandArray(body, () => new TransferProcess()));
  }

}
