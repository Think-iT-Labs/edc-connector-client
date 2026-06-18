import { EdcConnectorClientContext } from "../../context";
import { Inner } from "../../inner";

class IdentityRequestHelper {
  constructor(
    private readonly resourcePath: string,
    private readonly defaultContext?: EdcConnectorClientContext,
  ) {}

  getBasePath({ identityApiVersion }: EdcConnectorClientContext): string {
    return `/${identityApiVersion}/${this.resourcePath}`;
  }

  getActualContext(
    context?: EdcConnectorClientContext,
  ): EdcConnectorClientContext {
    const actualContext = context || this.defaultContext;
    if (!actualContext) {
      throw new Error("No context available for request");
    }
    return actualContext;
  }
}

export abstract class IdentityBaseController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;
  protected identity: IdentityRequestHelper;

  constructor(
    resourcePath: string,
    inner: Inner,
    context?: EdcConnectorClientContext,
  ) {
    this.inner = inner;
    this.context = context;
    this.identity = new IdentityRequestHelper(resourcePath, context);
  }
}
