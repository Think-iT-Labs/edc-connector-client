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
  #context?: EdcConnectorClientContext;
  protocol: String = "dataspace-protocol-http";
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async initiate(
    input: TransferProcessInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/transferprocesses",
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          "@context": this.defaultContextValues,
          protocol: this.protocol,
          ...input,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v2/transferprocesses/request",
        method: "POST",
        apiToken: actualContext.apiToken,
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
    transferProcessId: string,
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcessState> {
    const actualContext = context || this.#context!;
    
    return this.#inner.request(actualContext.management, {
      path: `/v2/transferprocesses/${transferProcessId}/state`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }
}
