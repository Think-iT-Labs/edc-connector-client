import { Addresses, EdcClient } from "../../src";

describe("DataController", () => {
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

  describe("edcClient.dataplane.registerDataplane", () => {
    it("succesfully register a dataplane", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const dataplaneInput = {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      };

      // when
      const registration = await edcClient.dataplane.registerDataplane(
        context,
        dataplaneInput,
      );

      // then
      expect(registration).toBeUndefined();
    });
  });

  describe("edcClient.dataplane.listDataplanes", () => {
    it("succesfully list available dataplanes", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
      const dataplaneInput = {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      };
      await edcClient.dataplane.registerDataplane(
        context,
        dataplaneInput,
      );

      // when
      const dataplanes = await edcClient.dataplane.listDataplanes(context);

      // then
      expect(dataplanes.length).toBeGreaterThan(0);

      dataplanes.forEach((dataplane) => {
        expect(dataplane).toHaveProperty("edctype", dataplaneInput.edctype);
        expect(dataplane).toHaveProperty("id", dataplaneInput.id);
        expect(dataplane).toHaveProperty("url", dataplaneInput.url);
        expect(dataplane).toHaveProperty(
          "allowedDestTypes",
          dataplaneInput.allowedDestTypes,
        );
        expect(dataplane).toHaveProperty(
          "allowedSourceTypes",
          dataplaneInput.allowedSourceTypes,
        );
        expect(dataplane).toHaveProperty(
          "properties",
          dataplaneInput.properties,
        );
      });
    });
  });
});
