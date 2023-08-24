import { EdcConnectorClientBuilder } from "../../src";

describe("ObservabilityController", () => {
    const edcClient = new EdcConnectorClientBuilder()
    .apiToken("123456")
    .defaultUrl("http://localhost:19191/api")
    .build();

  describe("edcClient.observability.checkHealth", () => {
    it("succesfully return a HealthStatus response", async () => {
      // when
      const healthStatus = await edcClient.observability.checkHealth();

      // then
      expect(healthStatus).toBeTruthy();
    });
  });

  describe("edcClient.observability.checkLiveness", () => {
    it("succesfully return a HealthStatus response", async () => {
      // when
      const healthStatus = await edcClient.observability.checkLiveness();

      // then
      expect(healthStatus).toBeTruthy();
    });
  });

  describe("edcClient.observability.checkReadiness", () => {
    it("succesfully return a HealthStatus response", async () => {
      // when
      const healthStatus = await edcClient.observability.checkReadiness();

      // then
      expect(healthStatus).toBeTruthy();
    });
  });

  describe("edcClient.observability.checkStartup", () => {
    it("succesfully return a HealthStatus response", async () => {
      // when
      const healthStatus = await edcClient.observability.checkStartup();

      // then
      expect(healthStatus).toBeTruthy();
    });
  });
});
