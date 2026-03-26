import { EdcConnectorClientContext } from "../../context";
import {
  JSON_LD_DEFAULT_CONTEXT,
  MANAGEMENT_API_VERSION_PATHS,
  MANAGEMENT_API_VERSIONS,
} from "../../entities";
import { EdcConnectorClientError } from "../../error";
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

  protected getContextUrl({ managementApiVersion }: EdcConnectorClientContext) {
    switch (managementApiVersion) {
      case "v3":
        return JSON_LD_DEFAULT_CONTEXT;

      case "v4beta":
        return ["https://w3id.org/edc/connector/management/v2"];

      default:
        throw new EdcConnectorClientError(
          `Failed to find context url for API version ${managementApiVersion}, Allowed values are ${MANAGEMENT_API_VERSIONS}`,
        );
    }
  }
}
