import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import { Catalog, QuerySpec } from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class CatalogsController extends ManagementBaseController {
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

    return this.fetch<Catalog[]>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/request`,
      method: "POST",
      authorization: actualContext.authorization,
      body,
    });
  }
}
