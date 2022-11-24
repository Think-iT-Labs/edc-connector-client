import { EdcClient, EdcClientContext } from "../src";
import { Addresses } from "../src";

describe("EdcClient", () => {
  it("instantiate a new class", async () => {
    // given
    const edcClient = new EdcClient();

    // then
    expect(edcClient).toBeInstanceOf(EdcClient);
    expect(edcClient).toHaveProperty("dataplane");
  });

  describe("edcClient.createContext", () => {
    it("creates a new EdcClientContext", async () => {
      // given
      const edcClient = new EdcClient();
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

      // when
      const context = edcClient.createContext(apiToken, addresses);

      // then
      expect(context).toBeInstanceOf(EdcClientContext);
      expect(context.apiToken).toBe(apiToken);
      expect(context.default).toBe(addresses.default);
      expect(context.validation).toBe(addresses.validation);
      expect(context.data).toBe(addresses.data);
      expect(context.ids).toBe(addresses.ids);
      expect(context.public).toBe(addresses.public);
      expect(context.control).toBe(addresses.control);
    });
  });
});
