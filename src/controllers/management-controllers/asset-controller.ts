import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  Asset,
  AssetInput,
  IdResponse,
  JsonLdService,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class AssetController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("assets", inner, jsonLdService, context);
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
        authorization: actualContext.authorization,
        body: {
          ...input,
          "@context": this.management.getContextUrl(actualContext),
        },
      })
      .then((body) => this.jsonLdService.expand(body, () => new IdResponse()));
  }

  async delete(
    assetId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${assetId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
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
        authorization: actualContext.authorization,
      })
      .then((body) => this.jsonLdService.expand(body, () => new Asset()));
  }

  async update(
    input: AssetInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "PUT",
      authorization: actualContext.authorization,
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
        authorization: actualContext.authorization,
        body: {
          ...query,
          "@context": this.management.getContextUrl(actualContext),
        },
      })
      .then((body) => this.jsonLdService.expandArray(body, () => new Asset()));
  }
}
