import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  ContractAgreement,
  ContractNegotiation,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class ContractAgreementController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("contractagreements", inner, context);
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement[]> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<ContractAgreement[]>(actualContext.management, {
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
    });
  }

  async get(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<ContractAgreement>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${agreementId}`,
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async getNegotiation(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<ContractNegotiation>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${agreementId}/negotiation`,
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async retire(
    agreementId: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${agreementId}/retire`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "RetireAgreement",
        reason: reason,
      },
    });
  }

  async unretire(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${agreementId}/unretire`,
      method: "POST",
      authorization: actualContext.authorization,
    });
  }
}
