import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  ContractAgreement,
  ContractNegotiation,
  ContractNegotiationRequest,
  ContractNegotiationState,
  IdResponse,
  QuerySpec,
  EDC_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class ContractNegotiationController {
  #inner: Inner;
  protocol: String = "dataspace-protocol-http";
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async initiate(
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
      .then((body) => expand(body, () => new IdResponse()));
  }

  async queryAll(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<ContractNegotiation[]> {
    return this.#inner
      .request(context.management, {
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
      .then((body) => expandArray(body, () => new ContractNegotiation()));
  }

  async get(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiation> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractnegotiations/${negotiationId}`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => expand(body, () => new ContractNegotiation()));
  }

  async getState(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractNegotiationState> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractnegotiations/${negotiationId}/state`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => expand(body, () => new ContractNegotiationState()));
  }

  async terminate(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v2/contractnegotiations/${negotiationId}/terminate`,
      method: "POST",
      apiToken: context.apiToken,
    });
  }

  async getAgreement(
    context: EdcConnectorClientContext,
    negotiationId: string,
  ): Promise<ContractAgreement> {
    return this.#inner
      .request(context.management, {
        path: `/v2/contractnegotiations/${negotiationId}/agreement`,
        method: "GET",
        apiToken: context.apiToken,
      })
      .then((body) => expand(body, () => new ContractAgreement()));
  }
}
