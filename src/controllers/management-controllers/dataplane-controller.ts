import { EdcConnectorClientContext } from "../../context";
import { expandArray, Dataplane } from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class DataplaneController extends ManagementBaseController {
  protected readonly resourcePath = "dataplanes";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async list(context?: EdcConnectorClientContext): Promise<Dataplane[]> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.getBasePath(actualContext),
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expandArray(body, () => new Dataplane()));
  }
}
