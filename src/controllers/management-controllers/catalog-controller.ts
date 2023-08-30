import { EdcConnectorClientContext } from "../../context";
import { EDC_CONTEXT, CatalogRequest, Catalog, expand } from "../../entities";
import { Inner } from "../../inner";

export class CatalogController {
  #inner: Inner;
  #context: EdcConnectorClientContext | undefined;
  protocol: String = "dataspace-protocol-http";
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async request(
    input: CatalogRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Catalog> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/catalog/request",
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.defaultContextValues,
          protocol: this.protocol,
          ...input,
        },
      })
      .then((body) => expand(body, () => new Catalog()));
  }

  /**
   * @deprecated please use `request` instead
   */
  async queryAll(
    input: CatalogRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Catalog> {
    return this.request(input, context);
  }
}
