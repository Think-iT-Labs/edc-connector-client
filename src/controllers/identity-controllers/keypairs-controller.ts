import { EdcConnectorClientContext } from "../../context";
import { KeyPair } from "../../entities/keypairs";
import { Inner } from "../../inner";
import { IdentityBaseController } from "./identity-base-controller";

export class KeyPairsController extends IdentityBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("keypairs", inner, context);
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<KeyPair[]>(actualContext.identity, {
      path: this.identity.getBasePath(actualContext),
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }
}
