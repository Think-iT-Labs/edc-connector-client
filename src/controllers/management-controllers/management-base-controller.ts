import { EdcConnectorClientContext } from "../../context";
import { JSON_LD_DEFAULT_CONTEXT } from "../../entities";
import { Inner } from "../../inner";

export abstract class ManagementBaseController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;

  protected abstract readonly resourcePath: string;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.inner = inner;
    this.context = context;
  }

  protected getBasePath({
    managementApiVersion,
  }: EdcConnectorClientContext): string {
    return `/${managementApiVersion}/${this.resourcePath}`;
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
    if (managementApiVersion === "v3") {
      return JSON_LD_DEFAULT_CONTEXT;
    }

    return ["https://w3id.org/edc/connector/management/v2"];
  }
}
