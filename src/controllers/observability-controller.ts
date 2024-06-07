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
      apiToken: actualContext.apiToken,
    });
  }

  async checkLiveness(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/liveness",
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }

  async checkReadiness(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/readiness",
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }

  async checkStartup(
    context?: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    const actualContext = context || this.context!;

    return this.inner.request(actualContext.default, {
      path: "/check/startup",
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }
}
