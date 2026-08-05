import { EdcConnectorClientContext } from "../../context";
import {
  CatalogRequest,
  Catalog,
  expand,
  Dataset,
  DatasetRequest,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class CatalogController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("catalog", inner, context);
  }

  async request(
    input: CatalogRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Catalog> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.management.getContextUrl(actualContext),
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
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/dataset/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.management.getContextUrl(actualContext),
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => expand(body, () => new Dataset()));
  }

}
