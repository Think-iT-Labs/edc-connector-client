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
  JSON_LD_DEFAULT_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class ContractNegotiationController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  protocol: String = "dataspace-protocol-http";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async initiate(
    input: ContractNegotiationRequest,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/contractnegotiations",
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          protocol: this.protocol,
          "@context": JSON_LD_DEFAULT_CONTEXT,
          ...input,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/contractnegotiations/request",
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
      .then((body) => expandArray(body, () => new ContractNegotiation()));
  }

  async get(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `/v2/contractnegotiations/${negotiationId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new ContractNegotiation()));
  }

  async getState(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiationState> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `/v2/contractnegotiations/${negotiationId}/state`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new ContractNegotiationState()));
  }

  async terminate(
    negotiationId: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `/v2/contractnegotiations/${negotiationId}/terminate`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        reason: reason,
        "@id": negotiationId,
        "@context": JSON_LD_DEFAULT_CONTEXT,
      },
    });
  }

  async getAgreement(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `/v2/contractnegotiations/${negotiationId}/agreement`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new ContractAgreement()));
  }
}
