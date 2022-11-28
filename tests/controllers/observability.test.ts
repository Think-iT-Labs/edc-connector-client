import { Addresses, EdcClient } from "../../src";

describe("ObservabilityController", () => {
  const apiToken = "123456";
  const addresses: Addresses = {
    default: "http://localhost:19191",
    validation: "http://localhost:19192",
    data: "http://localhost:19193",
    ids: "http://localhost:19194",
    dataplane: "http://localhost:19195",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };

  describe("edcClient.observability.checkHealth", () => {
    it("succesfully return a HealthStatus response", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const healthStatus = await edcClient.observability.checkHealth(context);

      // then
      expect(healthStatus).toBeTruthy();
    });
  });

  describe("edcClient.observability.checkLiveness", () => {
    it("succesfully return a HealthStatus response", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const healthStatus = await edcClient.observability.checkLiveness(context);

      // then
      expect(healthStatus).toBeTruthy();
    });
  });

  describe("edcClient.observability.checkReadiness", () => {
    it("succesfully return a HealthStatus response", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const healthStatus = await edcClient.observability.checkReadiness(
        context,
      );

      // then
      expect(healthStatus).toBeTruthy();
    });
  });

  describe("edcClient.observability.checkStartup", () => {
    it("succesfully return a HealthStatus response", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const healthStatus = await edcClient.observability.checkStartup(context);

      // then
      expect(healthStatus).toBeTruthy();
    });
  });
});
