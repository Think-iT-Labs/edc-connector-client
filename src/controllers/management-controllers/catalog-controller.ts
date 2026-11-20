import { EdcConnectorClientContext } from "../../context";
import {
  Catalog,
  CatalogRequest,
  Dataset,
  DatasetRequest,
  DEFAULT_PROTOCOL,
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

    return this.fetch<Catalog>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/request`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "CatalogRequest",
        ...input,
        protocol: input.protocol ?? DEFAULT_PROTOCOL,
      },
    });
  }

  async requestDataset(
    input: DatasetRequest,
    context?: EdcConnectorClientContext,
  ): Promise<Dataset> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<Dataset>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/dataset/request`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "DatasetRequest",
        ...input,
        protocol: input.protocol ?? DEFAULT_PROTOCOL,
      },
    });
  }
}
