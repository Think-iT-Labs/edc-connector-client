import { EdcConnectorClientContext } from "../../context";
import { JSON_LD_DEFAULT_CONTEXT, MANAGEMENT_V2_CONTEXT } from "../../entities";
import { Inner } from "../../inner";

class ManagementRequestHelper {
  constructor(
    private readonly resourcePath: string,
    private readonly defaultContext?: EdcConnectorClientContext,
  ) {}

  getBasePath({ managementApiVersion }: EdcConnectorClientContext): string {
    return `/${managementApiVersion}/${this.resourcePath}`;
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

  constructor(
    resourcePath: string,
    inner: Inner,
    context?: EdcConnectorClientContext,
  ) {
    this.inner = inner;
    this.context = context;
    this.management = new ManagementRequestHelper(resourcePath, context);
  }
}
