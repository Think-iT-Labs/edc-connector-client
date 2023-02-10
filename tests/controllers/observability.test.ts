import { Addresses, EdcConnectorClient } from "../../src";

describe("ObservabilityController", () => {
  const apiToken = "123456";
  const addresses: Addresses = {
    default: "http://localhost:19191/api",
    management: "http://localhost:19193/api/v1/data",
    protocol: "http://consumer-connector:9194/api/v1/ids",
    public: "http://localhost:19291/public",
    control: "http://localhost:19292/control",
  };

  describe("edcClient.observability.checkHealth", () => {
    it("succesfully return a HealthStatus response", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const healthStatus = await edcClient.observability.checkStartup(context);

      // then
      expect(healthStatus).toBeTruthy();
    });
  });
});
