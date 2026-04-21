import { DEFAULT_QUERY_SPEC } from "../../constants";
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
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("assets", inner, context);
  }

  async create(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: this.management.getBasePath(actualContext),
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          ...input,
          "@context": this.management.getContextUrl(actualContext),
        },
      })
      .then((body) => expand(body, () => new IdResponse()));
  }

  async delete(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${assetId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  async get(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<Asset> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${assetId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new Asset()));
  }

  async update(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "PUT",
      apiToken: actualContext.apiToken,
      body: {
        ...input,
        "@context": this.management.getContextUrl(actualContext),
      },
    });
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<Asset[]> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/request`,
        method: "POST",
        apiToken: actualContext.apiToken,
        body: {
          ...query,
          "@context": this.management.getContextUrl(actualContext),
        },
      })
      .then((body) => expandArray(body, () => new Asset()));
  }
}
