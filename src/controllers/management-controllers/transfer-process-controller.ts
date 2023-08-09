import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  IdResponse,
  QuerySpec,
  TransferProcess,
  TransferProcessInput,
  EDC_CONTEXT,
  TransferProcessState,
} from "../../entities";
import { Inner } from "../../inner";

export class TransferProcessController {
  #inner: Inner;
  protocol: String = "dataspace-protocol-http";
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async initiate(
    context: EdcConnectorClientContext,
    input: TransferProcessInput,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v2/transferprocesses",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          "@context": this.defaultContextValues,
          protocol: this.protocol,
          ...input,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async queryAll(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<TransferProcess[]> {
    return this.#inner
      .request(context.management, {
        path: "/v2/transferprocesses/request",
        method: "POST",
        apiToken: context.apiToken,
        body:
          Object.keys(query).length === 0
            ? null
            : {
                ...query,
                "@context": this.defaultContextValues,
              },
      })
      .then((body) => expandArray(body, () => new TransferProcess()));
  }

  async getState(
    context: EdcConnectorClientContext,
    transferProcessId: string,
  ): Promise<TransferProcessState> {
    return this.#inner.request(context.management, {
      path: `/v2/transferprocesses/${transferProcessId}/state`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }
}
