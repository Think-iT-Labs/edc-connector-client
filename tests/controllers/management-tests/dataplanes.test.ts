import { EdcConnectorClient } from "../../../src";

describe("DataplaneController", () => {

  const provider = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .protocolUrl("http://provider-connector:9194/protocol")
    .build();

  const dataplanes = provider.management.dataplanes;

  describe("register", () => {
    it("succesfully register a dataplane", async () => {
      const input = {
        id: "consumer-dataplane",
        url: "http://provider-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://provider-connector:9291/public/",
        },
      };

      const registration = await dataplanes.register(input);

      expect(registration).toBeUndefined();
    });
  });

  describe("list", () => {
    it("succesfully list available dataplanes", async () => {
      const input = {
        url: "http://provider-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://provider-connector:9291/public/",
        },
      };
      await dataplanes.register(input);

      const result = await dataplanes.list();

      expect(result.length).toBeGreaterThan(0);
      result.forEach((dataplane) => {
        expect(dataplane).toHaveProperty("id");
        expect(dataplane).toHaveProperty("url", input.url);
        expect(dataplane).toHaveProperty(
          "allowedDestTypes",
          input.allowedDestTypes,
        );
        expect(dataplane).toHaveProperty(
          "allowedSourceTypes",
          input.allowedSourceTypes,
        );

        expect(dataplane.properties.mandatoryValue('edc', 'publicApiUrl'))
          .toEqual("http://provider-connector:9291/public/")
      });
    });
  });
});
