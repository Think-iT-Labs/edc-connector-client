import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  ContractAgreement,
  ContractNegotiation,
  JsonLdService,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class ContractAgreementController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("contractagreements", inner, jsonLdService, context);
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement[]> {
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
      .then((body) =>
        this.jsonLdService.expandArray(body, () => new ContractAgreement()),
      );
  }

  async get(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${agreementId}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expand(body, () => new ContractAgreement()),
      );
  }

  async getNegotiation(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${agreementId}/negotiation`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expand(body, () => new ContractNegotiation()),
      );
  }
}
