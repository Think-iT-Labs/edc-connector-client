import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  ContractAgreement,
  ContractNegotiation,
  JSON_LD_DEFAULT_CONTEXT,
  JsonLdService,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";

export class ContractAgreementController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #jsonLdService: JsonLdService;
  #basePath = "/v3/contractagreements";

  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    this.#inner = inner;
    this.#context = context;
    this.#jsonLdService = jsonLdService;
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
      .then((body) =>
        this.#jsonLdService.expandArray(body, () => new ContractAgreement()),
      );
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
      .then((body) =>
        this.#jsonLdService.expand(body, () => new ContractAgreement()),
      );
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
      .then((body) =>
        this.#jsonLdService.expand(body, () => new ContractNegotiation()),
      );
  }
}
