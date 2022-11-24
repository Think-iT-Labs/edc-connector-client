import { EdcClientContext } from "../context";
import { HealthStatus } from "../entities";
import { Inner } from "../inner";

export class ObservabilityController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  async checkHealth(context: EdcClientContext): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/api/check/health",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async checkLiveness(context: EdcClientContext): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/api/check/liveness",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async checkReadiness(context: EdcClientContext): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/api/check/readiness",
      method: "GET",
      apiToken: context.apiToken,
    });
  }

  async checkStartup(context: EdcClientContext): Promise<HealthStatus> {
    return this.#inner.request(context.default, {
      path: "/api/check/startup",
      method: "GET",
      apiToken: context.apiToken,
    });
  }
}
