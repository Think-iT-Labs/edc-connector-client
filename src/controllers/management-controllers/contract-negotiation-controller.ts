import { EdcConnectorClientContext } from "../../context";
import {
  ContractAgreement,
  ContractNegotiation,
  ContractNegotiationRequest,
  ContractNegotiationState,
  expand,
  expandArray,
  IdResponse,
  QuerySpec
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class ContractNegotiationController extends ManagementBaseController {
  protected readonly resourcePath = "contractnegotiations";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async initiate(
    input: ContractNegotiationRequest,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.getBasePath(actualContext),
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          protocol: actualContext.protocolVersion,
          "@context": this.getContextUrl(actualContext),
          ...input,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async queryAll(
    query: QuerySpec = { "@type": "QuerySpec" },
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation[]> {
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
      .then((body) => expandArray(body, () => new ContractNegotiation()));
  }

  async get(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${negotiationId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new ContractNegotiation()));
  }

  async getState(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiationState> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${negotiationId}/state`,
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
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${negotiationId}/terminate`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@type": "TerminateNegotiation",
        reason: reason,
        "@id": negotiationId,
        "@context": this.getContextUrl(actualContext),
      },
    });
  }

  async getAgreement(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${negotiationId}/agreement`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new ContractAgreement()));
  }
}
