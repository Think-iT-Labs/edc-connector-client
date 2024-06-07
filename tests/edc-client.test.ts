import {
  EdcConnectorClient,
  EdcConnectorClientContext,
  EdcController,
} from "../src";
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

  describe("edcClient.Builder.use", () => {
    interface ActiveResponse {
      active: boolean;
    }

    class FooController extends EdcController {
      async testFoo(): Promise<ActiveResponse> {
        return {
          active: true,
        };
      }
    }

    class BarController extends EdcController {
      async testBar(): Promise<ActiveResponse> {
        return {
          active: false,
        };
      }
    }

    it("allows to extend the clients through middlewares", async () => {
      const client = new EdcConnectorClient.Builder()
        .use("foo", FooController)
        .use("bar", BarController)
        .build();

      await expect(client.foo.testFoo()).resolves.toEqual({
        active: true,
      });

      await expect(client.bar.testBar()).resolves.toEqual({
        active: false,
      });
    });
  });
});
