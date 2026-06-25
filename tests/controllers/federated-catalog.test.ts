import { EdcConnectorClient } from "../../src";
import { waitForFederatedCatalog } from "../test-utils";

describe("FederatedCatalogController", () => {
  const consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  describe("requestFederatedCatalog", () => {
    it("returns the federated catalog", async () => {
      await waitForFederatedCatalog(consumer, 1);

      const result = await consumer.management.federatedCatalog.queryAll({
        "@type": "QuerySpec",
        limit: 50,
      });

      expect(result.length).toBe(1);
      expect(result[0].participantId).toBe("provider");
    });
  });
});
