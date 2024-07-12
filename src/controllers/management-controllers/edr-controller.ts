import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  QuerySpec,
  JsonLdObject,
  JSON_LD_DEFAULT_CONTEXT,
  Edr
} from "../../entities";
import { Inner } from "../../inner";

export class EdrController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #basePath = "/v3/edrs";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async request(query: QuerySpec = {}, context?: EdcConnectorClientContext): Promise<Edr[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/request`,
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
      .then((body) => expandArray(body, () => new Edr()));
  }

  async delete(edrId: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
        path: `${this.#basePath}/${edrId}`,
        method: "DELETE",
        apiToken: actualContext.apiToken,
      });
  }

  async dataAddress(edrId: string, context?: EdcConnectorClientContext): Promise<JsonLdObject> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
        path: `${this.#basePath}/${edrId}/dataaddress`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new JsonLdObject()));
  }

}
