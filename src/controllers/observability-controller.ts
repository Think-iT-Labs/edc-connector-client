import { EdcConnectorClientContext } from "../context";
import { HealthStatus } from "../entities";
import { EdcController } from "../edc-controller";

export class ObservabilityController extends EdcController {
  async checkHealth(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/health",
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async checkLiveness(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/liveness",
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async checkReadiness(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/readiness",
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async checkStartup(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/startup",
      method: "GET",
      authorization: actualContext.authorization,
    });
  }
}
