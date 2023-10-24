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
  #basePath = '/v2/transferprocesses';
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
        path: `${this.#basePath}`,
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

  async get(id: string, context?: EdcConnectorClientContext): Promise<TransferProcess> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/${id}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new TransferProcess()));
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<TransferProcess[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `${this.#basePath}/request`,
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
      path: `${this.#basePath}/${transferProcessId}/state`,
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
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `${this.#basePath}/${id}/terminate`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@id": id,
        "@context": this.defaultContextValues,
        reason: reason
      },
    });
  }

  async deprovision(
    id: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `${this.#basePath}/${id}/deprovision`,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: {
        "@id": id,
        "@context": this.defaultContextValues
      },
    });
  }
}
