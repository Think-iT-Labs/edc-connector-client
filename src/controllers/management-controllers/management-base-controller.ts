import { EdcConnectorClientContext } from "../../context";
import { MANAGEMENT_API_VERSION_PATHS } from "../../entities";
import { Inner } from "../../inner";

export abstract class ManagementBaseController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;

  protected abstract readonly resourcePath: string;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.inner = inner;
    this.context = context;
  }

  protected getBasePath(context: EdcConnectorClientContext): string {
    const versionPath =
      MANAGEMENT_API_VERSION_PATHS[context.managementApiVersion];
    return `${versionPath}/${this.resourcePath}`;
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
