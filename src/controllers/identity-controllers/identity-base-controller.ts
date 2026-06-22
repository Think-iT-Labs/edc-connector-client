import { EdcConnectorClientContext } from "../../context";
import { Inner } from "../../inner";

export abstract class IdentityBaseController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;
  protected resourcePath: string;

  constructor(
    resourcePath: string,
    inner: Inner,
    context?: EdcConnectorClientContext,
  ) {
    this.inner = inner;
    this.context = context;
    this.resourcePath = resourcePath;
  }

  protected getBasePath({
    identityApiVersion,
  }: EdcConnectorClientContext): string {
    return `/${identityApiVersion}/${this.resourcePath}`;
  }

  protected getActualContext(
    context?: EdcConnectorClientContext,
  ): EdcConnectorClientContext {
    const actualContext = context || this.context;
    if (!actualContext) {
      throw new Error("No context available for request");
    }
    return actualContext;
  }
}
