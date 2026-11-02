import { EdcConnectorClientContext } from "../../context";
import { JsonLdService, MANAGEMENT_V2_CONTEXT } from "../../entities";
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

  getContextUrl({ managementJsonLdContext }: EdcConnectorClientContext) {
    if (managementJsonLdContext !== undefined) {
      return managementJsonLdContext;
    }

    return [MANAGEMENT_V2_CONTEXT];
  }
}

export abstract class ManagementBaseController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;
  protected management: ManagementRequestHelper;
  protected jsonLdService: JsonLdService;

  constructor(
    resourcePath: string,
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    this.inner = inner;
    this.context = context;
    this.management = new ManagementRequestHelper(resourcePath, context);
    this.jsonLdService = jsonLdService;
  }
}
