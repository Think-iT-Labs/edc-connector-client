import nock = require("nock");
import {
  Addresses,
  EdcConnectorClient,
  EdcConnectorClientContext,
  EdcController,
  JSON_LD_DEFAULT_CONTEXT,
  MANAGEMENT_V2_CONTEXT,
} from "../src";
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
      const addresses: Addresses = {
        default: "http://localhost:19191",
        management: "http://localhost:19193",
        protocol: "http://localhost:19194",
      };
      const protocol = "protocol";

      const context = EdcConnectorClient.createContext({
        addresses,
        protocolVersion: protocol,
        authorization: { "Authorization": "token" },
      });

      expect(context).toBeInstanceOf(EdcConnectorClientContext);
      expect(context.default).toBe(addresses.default);
      expect(context.management).toBe(addresses.management);
      expect(context.protocol).toBe(addresses.protocol);
      expect(context.protocolVersion).toBe(protocol);
      expect(context.authorization).toStrictEqual({ "Authorization": "token" });
    });

    it("creates context correctly with builder.build", () => {
      const defaultUrl = "http://localhost:19191";
      const managementUrl = "http://localhost:19193";
      const protocolUrl = "http://localhost:19194";
      const protocol = "protocol";

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .defaultUrl(defaultUrl)
        .protocolUrl(protocolUrl)
        .protocolVersion(protocol)
        .build();

      expect(client.context).toBeInstanceOf(EdcConnectorClientContext);
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
      const managementUrl = "https://example.com/management";

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .use("foo", FooController)
        .build();

      const inner = client.foo.getInner();
      expect(inner).toBeInstanceOf(Inner);

      const context = client.foo.getContext();
      expect(context).toBeInstanceOf(EdcConnectorClientContext);
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

  describe("managementJsonLdContext", () => {
    describe("createContext", () => {
      it("is undefined by default", () => {
        const context = EdcConnectorClient.createContext({
          addresses: { management: "http://localhost:19193/management" },
        });
        expect(context.managementJsonLdContext).toBeUndefined();
      });

      it("accepts a string URL", () => {
        const url = "https://custom.example.com/context/v1";
        const context = EdcConnectorClient.createContext({
          addresses: { management: "http://localhost:19193/management" },
          managementJsonLdContext: url,
        });
        expect(context.managementJsonLdContext).toBe(url);
      });

      it("accepts a JSON-LD context object", () => {
        const contextObj = { "@vocab": "https://custom.example.com/ns/" };
        const context = EdcConnectorClient.createContext({
          addresses: { management: "http://localhost:19193/management" },
          managementJsonLdContext: contextObj,
        });
        expect(context.managementJsonLdContext).toStrictEqual(contextObj);
      });

      it("accepts an array of URLs", () => {
        const urls = ["https://ctx1.example.com", "https://ctx2.example.com"];
        const context = EdcConnectorClient.createContext({
          addresses: { management: "http://localhost:19193/management" },
          managementJsonLdContext: urls,
        });
        expect(context.managementJsonLdContext).toStrictEqual(urls);
      });
    });

    describe("Builder", () => {
      it("sets managementJsonLdContext on the built context", () => {
        const url = "https://custom.example.com/context/v1";
        const client = new EdcConnectorClient.Builder()
          .managementUrl("http://localhost:19193/management")
          .managementJsonLdContext(url)
          .build();
        expect(client.context.managementJsonLdContext).toBe(url);
      });
    });

    describe("request @context", () => {
      const managementUrl = "http://localhost:19193/management";

      beforeEach(() => {
        if (!nock.isActive()) {
          nock.activate();
        }
      });

      afterEach(() => {
        nock.cleanAll();
        nock.restore();
      });

      it("uses JSON_LD_DEFAULT_CONTEXT for v3 by default", async () => {
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v3/assets/request", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, []);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementApiVersion("v3")
          .build();

        await client.management.assets.queryAll();

        expect(requestBody["@context"]).toStrictEqual(JSON_LD_DEFAULT_CONTEXT);
      });

      it("uses MANAGEMENT_V2_CONTEXT array for non-v3 by default", async () => {
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v4/assets/request", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, []);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementApiVersion("v4")
          .build();

        await client.management.assets.queryAll();

        expect(requestBody["@context"]).toStrictEqual([MANAGEMENT_V2_CONTEXT]);
      });

      it("overrides @context with a custom string URL", async () => {
        const customUrl = "https://custom.example.com/context/v1";
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v3/assets/request", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, []);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementJsonLdContext(customUrl)
          .build();

        await client.management.assets.queryAll();

        expect(requestBody["@context"]).toBe(customUrl);
      });

      it("overrides @context with a custom JSON-LD context object", async () => {
        const customContext = { "@vocab": "https://custom.example.com/ns/" };
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v3/assets/request", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, []);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementJsonLdContext(customContext)
          .build();

        await client.management.assets.queryAll();

        expect(requestBody["@context"]).toStrictEqual(customContext);
      });

      it("overrides @context with a custom array of URLs", async () => {
        const customUrls = [
          "https://ctx1.example.com",
          "https://ctx2.example.com",
        ];
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v3/assets/request", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, []);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementJsonLdContext(customUrls)
          .build();

        await client.management.assets.queryAll();

        expect(requestBody["@context"]).toStrictEqual(customUrls);
      });
    });
  });
});
