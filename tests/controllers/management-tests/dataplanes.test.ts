import { EdcConnectorClient } from "../../../src";

describe("DataplaneController", () => {

  const v4Provider = new EdcConnectorClient.Builder()
    .authorization("X-Api-Key", "123456")
    .managementUrl("http://localhost:29193/management")
    .managementApiVersion("v4")
    .build();

  const runDataplaneTests = (
    label: string,
    provider: EdcConnectorClient,
  ): void => {
    describe(label, () => {
      describe("list", () => {
        it("succesfully list available dataplanes", async () => {
          const result = await provider.management.dataplanes.list();

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
  };

  runDataplaneTests("v4", v4Provider);

});
