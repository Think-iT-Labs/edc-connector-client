import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  IdResponse,
  QuerySpec,
  TransferProcess,
  TransferProcessInput,
  TransferProcessState
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class TransferProcessController extends ManagementBaseController {
  protected readonly resourcePath = "transferprocesses";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async initiate(
    input: TransferProcessInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.getBasePath(actualContext),
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.getContextUrl(actualContext),
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async get(
    id: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${id}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new TransferProcess()));
  }

  async queryAll(
    query: QuerySpec = { "@type": "QuerySpec" },
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess[]> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body:
          Object.keys(query).length === 0
            ? null
            : {
              ...query,
              "@context": this.getContextUrl(actualContext),
            },
      })
      .then((body) => expandArray(body, () => new TransferProcess()));
  }

  async getState(
    transferProcessId: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcessState> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${transferProcessId}/state`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new TransferProcessState()));
  }

  async terminate(
    id: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${id}/terminate`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@id": id,
        "@context": this.getContextUrl(actualContext),
        reason: reason,
      },
    });
  }

  async suspend(
    id: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${id}/suspend`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@id": id,
        "@context": this.getContextUrl(actualContext),
        reason: reason,
      },
    });
  }

  async resume(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${id}/resume`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@id": id,
        "@context": this.getContextUrl(actualContext),
      },
    });
  }

  /**
   * @deprecated v3 only - not available in v4beta
   */
  async deprovision(
    id: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    if (actualContext.managementApiVersion === "v4beta") {
      console.warn(
        "Warning: deprovision() is only available in v3 API. " +
        "This endpoint does not exist in v4beta and the request will fail.",
      );
    }

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${id}/deprovision`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@id": id,
        "@context": this.getContextUrl(actualContext),
      },
    });
  }
}
