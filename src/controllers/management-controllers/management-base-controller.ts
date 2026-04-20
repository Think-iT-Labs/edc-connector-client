import { EdcConnectorClientContext } from "../../context";
import { JSON_LD_DEFAULT_CONTEXT, MANAGEMENT_V2_CONTEXT } from "../../entities";
import { Inner } from "../../inner";

class ManagementRequestHelper {
  constructor(
    private readonly getResourcePath: () => string,
    private readonly getDefaultContext: () => EdcConnectorClientContext | undefined,
  ) {}

  getBasePath({ managementApiVersion }: EdcConnectorClientContext): string {
    return `/${managementApiVersion}/${this.getResourcePath()}`;
  }

  getActualContext(
    context?: EdcConnectorClientContext,
  ): EdcConnectorClientContext {
    const actualContext = context || this.getDefaultContext();
    if (!actualContext) {
      throw new Error("No context available for request");
    }
    return actualContext;
  }

  getContextUrl({ managementApiVersion }: EdcConnectorClientContext) {
    if (managementApiVersion === "v3") {
      return JSON_LD_DEFAULT_CONTEXT;
    }

    return [MANAGEMENT_V2_CONTEXT];
  }
}

export abstract class ManagementBaseController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;
  protected management: ManagementRequestHelper;

  protected abstract readonly resourcePath: string;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.inner = inner;
    this.context = context;
    this.management = new ManagementRequestHelper(
      () => this.resourcePath,
      () => this.context,
    );
  }
}
