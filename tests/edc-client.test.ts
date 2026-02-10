import {
  EdcConnectorClient,
  EdcConnectorClientContext,
  EdcController,
} from "../src";
import { Addresses } from "../src";
import { Inner } from "../src/inner";

describe("EdcConnectorClient", () => {
  it("instantiate a new class", async () => {
    // given
    const edcClient = new EdcConnectorClient();

    // then
    expect(edcClient).toBeInstanceOf(EdcConnectorClient);
    expect(edcClient).toHaveProperty("management");
    expect(edcClient).toHaveProperty("observability");
  });

  describe("edcClient.createContext", () => {
    it("creates a new EdcConnectorClientContext", async () => {
      // given
      const apiToken = "123456";
      const addresses: Addresses = {
        default: "http://localhost:19191",
        management: "http://localhost:19193",
        protocol: "http://localhost:19194",
        control: "http://localhost:19292",
      };
      const protocol = "protocol";

      // when
      const context = EdcConnectorClient.createContext({
        token: apiToken,
        addresses,
        protocolVersion: protocol,
      });

      // then
      expect(context).toBeInstanceOf(EdcConnectorClientContext);
      expect(context.apiToken).toBe(apiToken);
      expect(context.default).toBe(addresses.default);
      expect(context.management).toBe(addresses.management);
      expect(context.protocol).toBe(addresses.protocol);
      expect(context.control).toBe(addresses.control);
      expect(context.protocolVersion).toBe(protocol);
    });

    it("creates context correctly with builder.build", () => {
      const apiToken = "123456";
      const defaultUrl = "http://localhost:19191";
      const managementUrl = "http://localhost:19193";
      const protocolUrl = "http://localhost:19194";
      const protocol = "protocol";

      const client = new EdcConnectorClient.Builder()
        .apiToken(apiToken)
        .managementUrl(managementUrl)
        .defaultUrl(defaultUrl)
        .protocolUrl(protocolUrl)
        .protocolVersion(protocol)
        .build();

      expect(client.context).toBeInstanceOf(EdcConnectorClientContext);
      expect(client.context.apiToken).toBe(apiToken);
      expect(client.context.default).toBe(defaultUrl);
      expect(client.context.management).toBe(managementUrl);
      expect(client.context.protocol).toBe(protocolUrl);
      expect(client.context.protocolVersion).toBe(protocol);
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

      getInner() {
        return this.inner;
      }

      getContext() {
        return this.context;
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

    it("exposes the custom controller on the client and wires internals", () => {
      const token = "test-token-123";
      const managementUrl = "https://example.com/management";

      const client = new EdcConnectorClient.Builder()
        .apiToken(token)
        .managementUrl(managementUrl)
        .use("foo", FooController)
        .build();

      const inner = client.foo.getInner();
      expect(inner).toBeInstanceOf(Inner);

      const context = client.foo.getContext();
      expect(context).toBeInstanceOf(EdcConnectorClientContext);

      expect(context?.apiToken).toBe(token);

      expect(context?.management).toBe(managementUrl);
    });
  });

  describe("edcClient.inner.#fetch", () => {
    it("accepts relative urls", async () => {
      const edcClient = new EdcConnectorClient.Builder()
        .apiToken("123456")
        .defaultUrl("/defaultUrl")
        .build();

      await expect(edcClient.observability.checkHealth()).rejects.not.toThrow(
        "Invalid URL",
      );
    });
  });
});
