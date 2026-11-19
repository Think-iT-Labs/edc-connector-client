import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  DEFAULT_PROTOCOL,
  withCallbackAddressType,
  IdResponse,
  QuerySpec,
  TransferProcess,
  TransferProcessInput,
  TransferProcessState,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class TransferProcessController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("transferprocesses", inner, context);
  }

  async initiate(
    input: TransferProcessInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<IdResponse>(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "TransferRequest",
        ...input,
        protocol: input.protocol ?? DEFAULT_PROTOCOL,
        callbackAddresses: withCallbackAddressType(input.callbackAddresses),
      },
    });
  }

  async get(
    id: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<TransferProcess>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}`,
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess[]> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<TransferProcess[]>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/request`,
      method: "POST",
      authorization: actualContext.authorization,
      body:
        Object.keys(query).length === 0
          ? null
          : {
              ...query,
              "@context": this.management.getContextUrl(actualContext),
            },
    });
  }

  async getState(
    transferProcessId: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcessState> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<TransferProcessState>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${transferProcessId}/state`,
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async terminate(
    id: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}/terminate`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "TerminateTransfer",
        "@id": id,
        reason: reason,
      },
    });
  }

  async suspend(
    id: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}/suspend`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "SuspendTransfer",
        reason,
      },
    });
  }

  async resume(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}/resume`,
      method: "POST",
      authorization: actualContext.authorization,
    });
  }
}
