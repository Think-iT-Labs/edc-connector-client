import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  IdResponse,
  JsonLdService,
  QuerySpec,
  TransferProcess,
  TransferProcessInput,
  TransferProcessState,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class TransferProcessController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("transferprocesses", inner, jsonLdService, context);
  }

  async initiate(
    input: TransferProcessInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.management.getBasePath(actualContext),
        method: "POST",
        authorization: actualContext.authorization,
        body: {
          "@context": this.management.getContextUrl(actualContext),
          "@type": "TransferRequest",
          protocol: actualContext.protocolVersion,
          ...input,
        },
      })
      .then((body) => this.jsonLdService.expand(body, () => new IdResponse()));
  }

  async get(
    id: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${id}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expand(body, () => new TransferProcess()),
      );
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess[]> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
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
      })
      .then((body) =>
        this.jsonLdService.expandArray(body, () => new TransferProcess()),
      );
  }

  async getState(
    transferProcessId: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcessState> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${transferProcessId}/state`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.jsonLdService.expand(body, () => new TransferProcessState()),
      );
  }

  async terminate(
    id: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
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
}
