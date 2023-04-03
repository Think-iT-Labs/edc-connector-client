import { EdcConnectorClientContext } from "../context";
import { HealthStatus } from "../entities";
import { Inner } from "../inner";

export class ObservabilityController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async checkHealth(context: EdcConnectorClientContext): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/check/health",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async checkLiveness(
    context: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/check/liveness",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async checkReadiness(
    context: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/check/readiness",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async checkStartup(
    context: EdcConnectorClientContext,
  ): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/check/startup",
      method: "GET",
      apiToken: context.apiToken,
    });
  }
}