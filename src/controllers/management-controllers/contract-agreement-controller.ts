import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  ContractAgreement,
  ContractNegotiation,
  QuerySpec,
  JSON_LD_DEFAULT_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class ContractAgreementController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #basePath = "/v3/contractagreements";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/request`,
        method: "POST",
        authorization: actualContext.authorization,
        body:
          Object.keys(query).length === 0
            ? null
            : {
                ...query,
                "@context": JSON_LD_DEFAULT_CONTEXT,
              },
      })
      .then((body) => expandArray(body, () => new ContractAgreement()));
  }

  async get(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractAgreement> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/${agreementId}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => expand(body, () => new ContractAgreement()));
  }

  async getNegotiation(
    agreementId: string,
    context?: EdcConnectorClientContext,
  ): Promise<ContractNegotiation> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/${agreementId}/negotiation`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => expand(body, () => new ContractNegotiation()));
  }
}
