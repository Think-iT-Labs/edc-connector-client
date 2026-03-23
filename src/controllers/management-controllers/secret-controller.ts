import { EdcConnectorClientContext } from "../../context";
import {
  compact,
  expand,
  IdResponse,
  Secret
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class SecretController extends ManagementBaseController {
  protected readonly resourcePath = "secrets";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  async create(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.getActualContext(context);

    const body = await compact({
      ...input,
      "@context": this.getContextUrl(actualContext),
    });

    return this.inner.request(actualContext.management, {
      path: this.getBasePath(actualContext),
      method: "POST",
      apiToken: actualContext.apiToken,
      body,
    });
  }

  async get(id: string, context?: EdcConnectorClientContext): Promise<Secret> {
    const actualContext = this.getActualContext(context);

    return this.inner
      .request(actualContext.management, {
        path: `${this.getBasePath(actualContext)}/${id}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      })
      .then((body) => expand(body, () => new Secret()));
  }

  async update(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.getActualContext(context);

    const body = await compact({
      ...input,
      "@context": this.getContextUrl(actualContext),
    });

    return this.inner.request(actualContext.management, {
      path: this.getBasePath(actualContext),
      method: "PUT",
      apiToken: actualContext.apiToken,
      body,
    });
  }

  async delete(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = this.getActualContext(context);

    return this.inner.request(actualContext.management, {
      path: `${this.getBasePath(actualContext)}/${id}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }
}
