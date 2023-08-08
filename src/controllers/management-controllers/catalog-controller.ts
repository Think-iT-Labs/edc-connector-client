import { EdcConnectorClientContext } from "../../context";
import { EDC_CONTEXT, CatalogRequest, Catalog, expand } from "../../entities";
import { Inner } from "../../inner";

export class CatalogController {
  #inner: Inner;
  protocol: String = "dataspace-protocol-http";
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async queryAll(
    context: EdcConnectorClientContext,
    input: CatalogRequest,
  ): Promise<Catalog> {
    return this.#inner
      .request(context.management, {
        path: "/v2/catalog/request",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          "@context": this.defaultContextValues,
          protocol: this.protocol,
          ...input,
        },
      })
      .then((body) => expand(body, () => new Catalog()));
  }
}
