import { EdcConnectorClient, EdcConnectorClientContext } from "../src";
import { Addresses } from "../src";

describe("EdcConnectorClient", () => {
  it("instantiate a new class", async () => {
    // given
    const edcClient = new EdcConnectorClient();

    // then
    expect(edcClient).toBeInstanceOf(EdcConnectorClient);
    expect(edcClient).toHaveProperty("management");
    expect(edcClient).toHaveProperty("observability");
    expect(edcClient).toHaveProperty("public");
  });

  describe("edcClient.createContext", () => {
    it("creates a new EdcConnectorClientContext", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const apiToken = "123456";
      const addresses: Addresses = {
        default: "http://localhost:19191",
        management: "http://localhost:19193",
        protocol: "http://localhost:19194",
        public: "http://localhost:19291",
        control: "http://localhost:19292",
      };

      // when
      const context = edcClient.createContext(apiToken, addresses);

      // then
      expect(context).toBeInstanceOf(EdcConnectorClientContext);
      expect(context.apiToken).toBe(apiToken);
      expect(context.default).toBe(addresses.default);
      expect(context.management).toBe(addresses.management);
      expect(context.protocol).toBe(addresses.protocol);
      expect(context.public).toBe(addresses.public);
      expect(context.control).toBe(addresses.control);
    });
  });
});
