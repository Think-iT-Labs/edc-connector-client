import { EdcConnectorClientContext } from "../../context";
import {
  expand,
  AssetResponse,
  AssetInput,
  IdResponse,
  QuerySpec,
  EDC_CONTEXT,
} from "../../entities";
import { Inner } from "../../inner";

export class AssetController {
  #inner: Inner;
  defaultContextValues = {
    edc: EDC_CONTEXT,
  };

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async create(
    context: EdcConnectorClientContext,
    input: AssetInput,
  ): Promise<IdResponse> {
    return this.#inner
      .request(context.management, {
        path: "/v3/assets",
        method: "POST",
        apiToken: context.apiToken,
        body: {
          ...input,
          "@context": this.defaultContextValues,
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: `/v3/assets/${assetId}`,
      method: "DELETE",
      apiToken: context.apiToken,
    });
  }

  async get(
    context: EdcConnectorClientContext,
    assetId: string,
  ): Promise<AssetResponse> {
    return this.#inner.request(context.management, {
      path: `/v3/assets/${assetId}`,
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async update(
    context: EdcConnectorClientContext,
    input: AssetInput,
  ): Promise<void> {
    return this.#inner.request(context.management, {
      path: "/v3/assets",
      method: "PUT",
      apiToken: context.apiToken,
      body: {
        ...input,
        "@context": this.defaultContextValues,
      },
    });
  }

  async queryAll(
    context: EdcConnectorClientContext,
    query: QuerySpec = {},
  ): Promise<AssetResponse[]> {
    return this.#inner.request(context.management, {
      path: "/v3/assets/request",
      method: "POST",
      apiToken: context.apiToken,
      body:
        Object.keys(query).length === 0
          ? null
          : {
              ...query,
              "@context": this.defaultContextValues,
            },
    });
  }
}
