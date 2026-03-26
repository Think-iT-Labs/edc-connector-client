import { EdcConnectorClientContext } from "../../context";
import {
  Catalog,
  CatalogRequest,
  Dataset,
  DatasetRequest,
  expand
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class CatalogController extends ManagementBaseController {
  protected readonly resourcePath = "catalog";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async request(
    input: CatalogRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Catalog> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.getContextUrl(actualContext),
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => expand(body, () => new Catalog()));
  }

  async requestDataset(
    input: DatasetRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Dataset> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/dataset/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.getContextUrl(actualContext),
          protocol: actualContext.protocolVersion,
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
