import { DEFAULT_QUERY_SPEC } from "../constants";
import { EdcConnectorClientContext } from "../context";
import { expandArray, Catalog, QuerySpec } from "../entities";
import { Inner } from "../inner";
import { ManagementBaseController } from "./management-controllers/management-base-controller";

export class FederatedCatalogController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("catalogs", inner, context);
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<Catalog[]> {
    const actualContext = this.management.getActualContext(context);

    const body =
      Object.keys(query).length === 0
        ? null
        : {
            ...query,
            "@context": this.management.getContextUrl(actualContext),
          };

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body,
      })
      .then((body) => expandArray(body, () => new Catalog()));
  }
}
