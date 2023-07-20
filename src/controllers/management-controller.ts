import { EdcConnectorClientContext } from "../context";
import {
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
  CreateResult,
  DataAddressProperties,
  Dataplane,
  DataplaneInput,
  DCATCatalog,
  PolicyDefinition,
  PolicyDefinitionInput,
  QuerySpec,
  TransferProcess,
  TransferProcessInput,
} from "../entities";
import { Inner } from "../inner";
import jsonld from "jsonld";

export class ManagementController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async registerDataplane(
    context: EdcConnectorClientContext,
    input: DataplaneInput,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: "/instances",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async listDataplanes(
    context: EdcConnectorClientContext,
  ): Promise<Dataplane[]> {
    return this.#inner.request(context.management, {
      path: "/instances",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async createAsset(
    context: EdcConnectorClientContext,
    input: AssetInput,
  ): Promise<AssetResponse> {
    return this.#inner.request(context.management, {
      path: "/assets",
      method: "POST",
      apiToken: context.apiToken,
      body: input,
    });
  }

  async deleteAsset(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/assets/${assetId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getAsset(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<AssetResponse> {
    return this.#inner.request(context.management, {
      path: `/assets/${assetId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async getAssetDataAddress(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<DataAddressProperties> {
    return this.#inner.request(context.management, {
      path: `/assets/${assetId}/dataaddress`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllAssets(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<AssetResponse[]> {
    return this.#inner.request(context.management, {
      path: "/assets/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }

  async createPolicy(
    context: EdcConnectorClientContext,
    input: PolicyDefinitionInput,
  ): Promise<CreateResult> {
    return this.#inner.request(context.management, {
      path: "/policydefinitions",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        "@context": {
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        ...input,
      },
    });
  }

  async deletePolicy(
    context: EdcConnectorClientContext,
    policyId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/policydefinitions/${policyId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getPolicy(
    context: EdcConnectorClientContext,
    policyId: string,
  ): Promise<PolicyDefinition> {
    return this.#inner.request(context.management, {
      path: `/policydefinitions/${policyId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllPolicies(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<PolicyDefinition[]> {
    return this.#inner.request(context.management, {
      path: "/policydefinitions/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }

  async createContractDefinition(
    context: EdcConnectorClientContext,
    input: ContractDefinitionInput,
  ): Promise<CreateResult> {
    return this.#inner.request<any>(context.management, {
      path: "/contractdefinitions",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        ...input,
      },
    });
  }

  async deleteContractDefinition(
    context: EdcConnectorClientContext,
    contractDefinitionId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/contractdefinitions/${contractDefinitionId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async getContractDefinition(
    context: EdcConnectorClientContext,
    contractDefinitionId: string,
  ): Promise<ContractDefinition> {
    return this.#inner.request(context.management, {
      path: `/contractdefinitions/${contractDefinitionId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllContractDefinitions(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractDefinition[]> {
    return this.#inner
      .request<any>(context.management, {
        path: "/contractdefinitions/request",
        method: "POST",
        apiToken: context.apiToken,
        body: query,
      })
      .then((body) => jsonld.expand(body))
      .then((expanded) =>
        (expanded as Array<any>).map((it) =>
          Object.assign(new ContractNegotiation(), it),
        ),
      );
  }

  async requestCatalog(
    context: EdcConnectorClientContext,
    input: CatalogRequest,
  ): Promise<Catalog> {
    return this.#inner.request(context.management, {
      path: "/catalog/request",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        "@context": {
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        protocol: "dataspace-protocol-http",
        ...input,
      },
    });
  }

  async requestDcatCatalog(
    context: EdcConnectorClientContext,
    input: CatalogRequest,
  ): Promise<DCATCatalog> {
    return this.#inner
      .request<any>(context.management, {
        path: "/catalog/request",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          "@context": {
            edc: "https://w3id.org/edc/v0.0.1/ns/",
          },
          protocol: "dataspace-protocol-http",
          ...input,
        },
      })
      .then((body) => jsonld.expand(body))
      .then((expanded) => Object.assign(new DCATCatalog(), expanded[0]));
  }

  async initiateContractNegotiation(
    context: EdcConnectorClientContext,
    input: ContractNegotiationRequest,
  ): Promise<CreateResult> {
    return this.#inner.request<any>(context.management, {
      path: "/contractnegotiations",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        "@context": {
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        ...input,
      },
    });
  }

  async queryNegotiations(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractNegotiation[]> {
    return this.#inner.request(context.management, {
      path: "/contractnegotiations/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }

  async getNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiation> {
    return this.#inner
      .request<any>(context.management, {
        path: `/contractnegotiations/${negotiationId}`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => jsonld.expand(body))
      .then((expanded) =>
        Object.assign(new ContractNegotiation(), expanded[0]),
      );
  }

  async getNegotiationState(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiationState> {
    return this.#inner
      .request<any>(context.management, {
        path: `/contractnegotiations/${negotiationId}/state`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => jsonld.expand(body))
      .then((expanded) =>
        Object.assign(new ContractNegotiationState(), expanded[0]),
      );
  }

  async cancelNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/contractnegotiations/${negotiationId}/cancel`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async declineNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/contractnegotiations/${negotiationId}/decline`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async getAgreementForNegotiation(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractAgreement> {
    return this.#inner.request(context.management, {
      path: `/contractnegotiations/${negotiationId}/agreement`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async queryAllAgreements(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractAgreement[]> {
    return this.#inner.request(context.management, {
      path: "/contractagreements/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }

  async getAgreement(
    context: EdcConnectorClientContext,
    agreementId: string,
  ): Promise<ContractAgreement> {
    return this.#inner
      .request<any>(context.management, {
        path: `/contractagreements/${agreementId}`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => jsonld.expand(body))
      .then((expanded) => Object.assign(new ContractAgreement(), expanded[0]));
  }

  async initiateTransfer(
    context: EdcConnectorClientContext,
    input: TransferProcessInput,
  ): Promise<CreateResult> {
    return this.#inner.request<any>(context.management, {
      path: "/transferprocesses",
      method: "POST",
      apiToken: context.apiToken,
      body: {
        "@context": {
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        ...input,
      },
    });
  }

  async queryAllTransferProcesses(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<TransferProcess[]> {
    return this.#inner.request(context.management, {
      path: "/transferprocess/request",
      method: "POST",
      apiToken: context.apiToken,
      body: query,
    });
  }
}
