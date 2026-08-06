import { EdcConnectorClient } from "../../../src";
import { waitForCatalogs } from "../../test-utils";

describe("CatalogsController", () => {
  const consumer = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .build();

  describe("queryAll", () => {
    it("returns the catalogs", async () => {
      await waitForCatalogs(consumer, 1);

      const result = await consumer.management.catalogs.queryAll({
        "@type": "QuerySpec",
        limit: 50,
      });

      expect(result.length).toBe(1);
      expect(result[0].participantId).toBe("provider");
    });
  });
});
