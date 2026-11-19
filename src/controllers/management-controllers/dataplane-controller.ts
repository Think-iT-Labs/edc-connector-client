import { EdcConnectorClientContext } from "../../context";
import { Dataplane, DataplaneRegistrationInput } from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class DataplaneController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("dataplanes", inner, context);
  }

  async list(context?: EdcConnectorClientContext): Promise<Dataplane[]> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<Dataplane[]>(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  /**
   * Registers (or updates) a data plane instance through the V4 Data Plane
   * Signaling registration endpoint (`PUT /{version}/dataplanes`).
   */
  async register(
    input: DataplaneRegistrationInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "PUT",
      authorization: actualContext.authorization,
      body: input,
    });
  }

  /**
   * Deletes (unregisters) a data plane instance through the V4 Data Plane
   * Signaling registration endpoint (`DELETE /{version}/dataplanes/{id}`).
   */
  async delete(id: string, context?: EdcConnectorClientContext): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${id}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }
}
