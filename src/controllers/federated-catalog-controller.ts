import { EdcConnectorClientContext } from "../context";
import { EdcController } from "../edc-controller";
import {
  expandArray,
  Catalog,
  QuerySpec,
  JSON_LD_DEFAULT_CONTEXT,
} from "../entities";
import { Inner } from "../inner";

export class FederatedCatalogController extends EdcController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<Catalog[]> {
    const actualContext = context || this.context!;

    return this.inner
      .request(actualContext.federatedCatalog, {
        path: "/v1alpha/catalog/query",
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
      .then((body) => expandArray(body, () => new Catalog()));
  }
}
