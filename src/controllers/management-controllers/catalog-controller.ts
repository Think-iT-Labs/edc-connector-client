import { EdcConnectorClientContext } from "../../context";
import {
  Catalog,
  CatalogRequest,
  Dataset,
  DatasetRequest,
  JsonLdService,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class CatalogController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("catalog", inner, jsonLdService, context);
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
        authorization: actualContext.authorization,
        body: {
          "@context": this.management.getContextUrl(actualContext),
          "@type": "CatalogRequest",
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => this.jsonLdService.expand(body, () => new Catalog()));
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
        authorization: actualContext.authorization,
        body: {
          "@context": this.management.getContextUrl(actualContext),
          "@type": "DatasetRequest",
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => this.jsonLdService.expand(body, () => new Dataset()));
  }
}
