import { EdcConnectorClient } from "../../../src";

describe("DataplaneController", () => {

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol/2025-1")
    .build();

  const dataplanes = provider.management.dataplanes;

  describe("list", () => {
    it("succesfully list available dataplanes", async () => {
      const result = await dataplanes.list();

      expect(result.length).toBeGreaterThan(0);
      result.forEach((dataplane) => {
        expect(dataplane).toHaveProperty("id");
        expect(dataplane).toHaveProperty("url");
        expect(dataplane).toHaveProperty("allowedSourceTypes");
        expect(dataplane).toHaveProperty("allowedTransferTypes");
      });
    });
  });

});
