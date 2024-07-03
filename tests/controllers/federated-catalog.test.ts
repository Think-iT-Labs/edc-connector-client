import { EdcConnectorClient } from "../../src";
import { waitForFederatedCatalog } from "../test-utils";

describe("FederatedCatalogController", () => {
  const consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .federatedCatalogUrl("http://localhost:19393/catalog")
    .build();

  describe("requestFederatedCatalog", () => {
    it("returns the federated catalog", async () => {
      await waitForFederatedCatalog(consumer, 1);

      const result = await consumer.federatedCatalog.queryAll({ limit: 50 });

      expect(result.length).toBe(1);
      expect(result[0].participantId).toBe("provider");
    });
  });
});
