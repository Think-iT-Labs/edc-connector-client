import { EdcConnectorClientContext } from "../../context";
import { MANAGEMENT_V2_CONTEXT } from "../../entities";
import { withLegacyAccessors } from "../../entities/jsonld/legacy-accessors";
import { Inner, InnerRequest } from "../../inner";

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

  constructor(
    resourcePath: string,
    inner: Inner,
    context?: EdcConnectorClientContext,
  ) {
    this.inner = inner;
    this.context = context;
    this.management = new ManagementRequestHelper(resourcePath, context);
  }

  /**
   * Performs a request, returning the response body as sent by the connector,
   * with the accessors kept for compatibility with 0.11.x.
   */
  protected async fetch<T>(
    baseUrl: string,
    innerRequest: InnerRequest,
  ): Promise<T> {
    return withLegacyAccessors(
      await this.inner.request<T>(baseUrl, innerRequest),
    );
  }
}
