import { Inner } from "../../inner";
import { EdcConnectorClientContext } from "../../context";
import { VerifiableCredentialsResource } from "../../entities/verifiable-credentials";
import { IdentityBaseController } from "./identity-base-controller";

export class VerifiableCredentialsController extends IdentityBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("credentials", inner, context);
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<VerifiableCredentialsResource[]>(
      actualContext.identity,
      {
        path: this.identity.getBasePath(actualContext),
        method: "GET",
        apiToken: actualContext.apiToken,
        query,
      },
    );
  }
}
