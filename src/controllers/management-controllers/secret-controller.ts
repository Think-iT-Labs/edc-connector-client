import { EdcConnectorClientContext } from "../../context";
import {
  IdResponse,
  JSON_LD_DEFAULT_CONTEXT,
  JsonLdService,
  Secret,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class SecretController extends ManagementBaseController {
  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super("secrets", inner, jsonLdService, context);
  }

  async create(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    const body = await this.jsonLdService.compact({
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT,
    });

    return this.inner.request(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "POST",
      authorization: actualContext.authorization,
      body,
    });
  }

  async get(id: string, context?: EdcConnectorClientContext): Promise<Secret> {
    const actualContext = this.management.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.management.getBasePath(actualContext)}/${id}`,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) => this.jsonLdService.expand(body, () => new Secret()));
  }

  async update(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    const body = await this.jsonLdService.compact({
      ...input,
      "@context": JSON_LD_DEFAULT_CONTEXT,
    });

    return this.inner.request(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "PUT",
      authorization: actualContext.authorization,
      body,
    });
  }

  async delete(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }
}
