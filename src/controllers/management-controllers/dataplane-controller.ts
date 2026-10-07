import { EdcConnectorClientContext } from "../../context";
import { Dataplane, JsonLdService } from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class DataplaneController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("dataplanes", inner, jsonLdService, context);
  }

  async list(context?: EdcConnectorClientContext): Promise<Dataplane[]> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.management.getBasePath(actualContext),
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expandArray(body, () => new Dataplane()),
      );
  }
}
