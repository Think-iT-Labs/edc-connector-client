import { EdcConnectorClientContext } from "../../context";
import {
  Asset,
  AssetInput,
  expand,
  expandArray,
  IdResponse,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class AssetController extends ManagementBaseController {
  protected readonly resourcePath = "assets";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async create(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.getBasePath(actualContext),
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          ...input,
          "@context": this.getContextUrl(actualContext),
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${assetId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<Asset> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${assetId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new Asset()));
  }

  async update(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: this.getBasePath(actualContext),
      method: "PUT",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": this.getContextUrl(actualContext),
      },
    });
  }

  async queryAll(
    query: QuerySpec = { "@type": "QuerySpec" },
    context?: EdcConnectorClientContext,
  ): Promise<Asset[]> {
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
      .then((body) => expandArray(body, () => new Asset()));
  }
}
