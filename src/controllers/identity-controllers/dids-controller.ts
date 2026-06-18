import { EdcConnectorClientContext } from "../../context";
import { DIDDocument } from "../../entities/DID";
import { Inner } from "../../inner";
import { IdentityBaseController } from "./identity-base-controller";

export class DIDsController extends IdentityBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("dids", inner, context);
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<DIDDocument[]>(actualContext.identity, {
      path: this.identity.getBasePath(actualContext),
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }
}
