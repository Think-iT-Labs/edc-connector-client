import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  ContractAgreement,
  ContractNegotiation,
  ContractNegotiationRequest,
  ContractNegotiationState,
  expand,
  expandArray,
  IdResponse,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class ContractNegotiationController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("contractnegotiations", inner, context);
  }

  async initiate(
    input: ContractNegotiationRequest,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.management.getBasePath(actualContext),
        method: "POST",
        authorization: actualContext.authorization,
        body: {
          "@context": this.management.getContextUrl(actualContext),
          "@type": "ContractRequest",
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation[]> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/request`,
        method: "POST",
        authorization: actualContext.authorization,
        body:
          Object.keys(query).length === 0
            ? null
            : {
                ...query,
                "@context": this.management.getContextUrl(actualContext),
              },
      })
      .then((body) => expandArray(body, () => new ContractNegotiation()));
  }

  async get(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${negotiationId}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => expand(body, () => new ContractNegotiation()));
  }

  async getState(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiationState> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${negotiationId}/state`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => expand(body, () => new ContractNegotiationState()));
  }

  async terminate(
    negotiationId: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${negotiationId}/terminate`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        ...(actualContext.managementApiVersion === "v4"
          ? { "@type": "TerminateNegotiation" }
          : {}),
        "@id": negotiationId,
        reason: reason,
      },
    });
  }

  async getAgreement(
    negotiationId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${negotiationId}/agreement`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => expand(body, () => new ContractAgreement()));
  }
}
