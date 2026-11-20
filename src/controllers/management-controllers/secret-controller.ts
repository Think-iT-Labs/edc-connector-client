import { EdcConnectorClientContext } from "../../context";
import { IdResponse, Secret } from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class SecretController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("secrets", inner, context);
  }

  async create(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    const body = this.buildBody(input, actualContext);

    return this.fetch<IdResponse>(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "POST",
      authorization: actualContext.authorization,
      body,
    });
  }

  async get(id: string, context?: EdcConnectorClientContext): Promise<Secret> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<Secret>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}`,
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async update(
    input: Secret,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    const body = this.buildBody(input, actualContext);

    return this.fetch(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "PUT",
      authorization: actualContext.authorization,
      body,
    });
  }

  private buildBody(input: Secret, context: EdcConnectorClientContext): object {
    return {
      ...input,
      "@context": this.management.getContextUrl(context),
      "@type": "Secret",
    };
  }

  async delete(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }
}
