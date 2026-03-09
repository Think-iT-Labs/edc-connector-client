import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  QuerySpec,
  JsonLdObject,
  JSON_LD_DEFAULT_CONTEXT,
  Edr,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class EdrController extends ManagementBaseController {
  protected readonly resourcePath = "edrs";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async request(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<Edr[]> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/request`,
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
      .then((body) => expandArray(body, () => new Edr()));
  }

  async delete(
    edrId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${edrId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async dataAddress(
    edrId: string,
    context?: EdcConnectorClientContext,
  ): Promise<JsonLdObject> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${edrId}/dataaddress`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new JsonLdObject()));
  }
}
