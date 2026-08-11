import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  Edr,
  JSON_LD_DEFAULT_CONTEXT,
  JsonLdObject,
  JsonLdService,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";

export class EdrController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #jsonLdService: JsonLdService;
  #basePath = "/v3/edrs";

  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    this.#inner = inner;
    this.#context = context;
    this.#jsonLdService = jsonLdService;
  }

  async request(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<Edr[]> {
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
      .then((body) => this.#jsonLdService.expandArray(body, () => new Edr()));
  }

  async delete(
    edrId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `${this.#basePath}/${edrId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }

  async dataAddress(
    edrId: string,
    context?: EdcConnectorClientContext,
  ): Promise<JsonLdObject> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/${edrId}/dataaddress`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.#jsonLdService.expand(body, () => new JsonLdObject()),
      );
  }
}
