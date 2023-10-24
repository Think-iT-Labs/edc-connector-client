import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  expandArray,
  Asset,
  AssetInput,
  IdResponse,
  QuerySpec,
  JSON_LD_DEFAULT_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class AssetController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async create(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v3/assets",
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          ...input,
          "@context": JSON_LD_DEFAULT_CONTEXT,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: `/v3/assets/${assetId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<Asset> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: `/v3/assets/${assetId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new Asset()));
  }

  async update(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = context || this.#context!;

    return this.#inner.request(actualContext.management, {
      path: "/v3/assets",
      method: "PUT",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": JSON_LD_DEFAULT_CONTEXT,
      },
    });
  }

  async queryAll(
    query: QuerySpec = {},
    context?: EdcConnectorClientContext,
  ): Promise<Asset[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: "/v3/assets/request",
        method: "POST",
        apiToken: actualContext.apiToken,
        body:
          Object.keys(query).length === 0
            ? null
            : {
                ...query,
                "@context": JSON_LD_DEFAULT_CONTEXT,
              },
      })
      .then((body) => expandArray(body, () => new Asset()));
  }
}
