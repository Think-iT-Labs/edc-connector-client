import { EdcConnectorClientContext } from "../../context";
import {
  JSON_LD_DEFAULT_CONTEXT, CatalogRequest, Catalog, expand, Dataset, DatasetRequest
} from "../../entities";
import { Inner } from "../../inner";

export class CatalogController {
  #inner: Inner;
  #context: EdcConnectorClientContext | undefined;
  protocol: String = "dataspace-protocol-http";

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
          "@context": JSON_LD_DEFAULT_CONTEXT,
          protocol: this.protocol,
          ...input,
        },
      })
      .then((body) => expand(body, () => new Catalog()));
  }

  async requestDataset(
    input: DatasetRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Dataset> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/catalog/dataset/request",
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": JSON_LD_DEFAULT_CONTEXT,
          protocol: this.protocol,
          ...input,
        },
      })
      .then((body) => expand(body, () => new Dataset()));
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
