import nock from "nock";
import {
  Addresses,
  EdcConnectorClient,
  EdcConnectorClientContext,
  EdcController,
  MANAGEMENT_V2_CONTEXT,
  SecretBuilder,
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
      };

      const context = EdcConnectorClient.createContext({
        addresses,
        authorization: { Authorization: "token" },
      });

      expect(context).toBeInstanceOf(EdcConnectorClientContext);
      expect(context.default).toBe(addresses.default);
      expect(context.management).toBe(addresses.management);
      expect(context.authorization).toStrictEqual({ Authorization: "token" });
    });

    it("creates context correctly with builder.build", () => {
      const defaultUrl = "http://localhost:19191";
      const managementUrl = "http://localhost:19193";

      const client = new EdcConnectorClient.Builder()
        .managementUrl(managementUrl)
        .defaultUrl(defaultUrl)
        .build();

      expect(client.context).toBeInstanceOf(EdcConnectorClientContext);
      expect(client.context.default).toBe(defaultUrl);
      expect(client.context.management).toBe(managementUrl);
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

      it("uses the MANAGEMENT_V2_CONTEXT array by default", async () => {
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v4/assets/request", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, []);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .build();

        await client.management.assets.queryAll();

        expect(requestBody["@context"]).toStrictEqual([MANAGEMENT_V2_CONTEXT]);
      });

      it("overrides @context with a custom string URL", async () => {
        const customUrl = "https://custom.example.com/context/v1";
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v4/assets/request", (body) => {
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
          .post("/management/v4/assets/request", (body) => {
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
          .post("/management/v4/assets/request", (body) => {
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

    describe("secrets version-aware path", () => {
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

      it("creates secrets on the v4 path", async () => {
        let requestBody: any;
        nock("http://localhost:19193")
          .post("/management/v4/secrets", (body) => {
            requestBody = body;
            return true;
          })
          .reply(200, { "@id": "secretId", createdAt: 1 });

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementApiVersion("v4")
          .build();

        const secret = new SecretBuilder()
          .id("secretId")
          .value("secretValue")
          .build();

        const idResponse = await client.management.secrets.create(secret);

        expect(requestBody["@id"]).toBe("secretId");
        expect(idResponse["@id"]).toBe("secretId");
      });

      it("gets, updates and deletes secrets on the v4 path", async () => {
        const scope = nock("http://localhost:19193")
          .get("/management/v4/secrets/secretId")
          .reply(200, {
            "@id": "secretId",
            "https://w3id.org/edc/v0.0.1/ns/value": "secretValue",
          })
          .put("/management/v4/secrets")
          .reply(204)
          .delete("/management/v4/secrets/secretId")
          .reply(204);

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .managementApiVersion("v4")
          .build();

        const secret = await client.management.secrets.get("secretId");
        expect(secret.id).toBe("secretId");

        const updated = new SecretBuilder()
          .id("secretId")
          .value("updatedSecretValue")
          .build();
        await client.management.secrets.update(updated);

        await client.management.secrets.delete("secretId");

        expect(scope.isDone()).toBe(true);
      });

      it("uses the v4 path by default", async () => {
        const scope = nock("http://localhost:19193")
          .post("/management/v4/secrets")
          .reply(200, { "@id": "secretId", createdAt: 1 });

        const client = new EdcConnectorClient.Builder()
          .managementUrl(managementUrl)
          .build();

        const secret = new SecretBuilder()
          .id("secretId")
          .value("secretValue")
          .build();

        await client.management.secrets.create(secret);

        expect(scope.isDone()).toBe(true);
      });
    });
  });

  describe("v4 input fields", () => {
    const managementUrl = "http://localhost:19193/management";

    const v4Client = new EdcConnectorClient.Builder()
      .managementUrl(managementUrl)
      .managementApiVersion("v4")
      .build();

    beforeEach(() => {
      if (!nock.isActive()) {
        nock.activate();
      }
    });

    afterEach(() => {
      nock.cleanAll();
      nock.restore();
    });

    it("forwards catalog request profile and additionalScopes", async () => {
      let requestBody: any;
      nock("http://localhost:19193")
        .post("/management/v4/catalog/request", (body) => {
          requestBody = body;
          return true;
        })
        .reply(200, {});

      await v4Client.management.catalog.request({
        "@type": "CatalogRequest",
        counterPartyAddress: "http://provider/protocol",
        counterPartyId: "provider",
        profile: "https://w3id.org/dspace/2025/1/profile",
        additionalScopes: ["scope-a", "scope-b"],
      });

      expect(requestBody.profile).toBe(
        "https://w3id.org/dspace/2025/1/profile",
      );
      expect(requestBody.additionalScopes).toStrictEqual([
        "scope-a",
        "scope-b",
      ]);
    });

    it("forwards dataset request profile and additionalScopes", async () => {
      let requestBody: any;
      nock("http://localhost:19193")
        .post("/management/v4/catalog/dataset/request", (body) => {
          requestBody = body;
          return true;
        })
        .reply(200, {});

      await v4Client.management.catalog.requestDataset({
        "@type": "DatasetRequest",
        "@id": "dataset-id",
        counterPartyAddress: "http://provider/protocol",
        counterPartyId: "provider",
        profile: "https://w3id.org/dspace/2025/1/profile",
        additionalScopes: ["scope-a", "scope-b"],
      });

      expect(requestBody.profile).toBe(
        "https://w3id.org/dspace/2025/1/profile",
      );
      expect(requestBody.additionalScopes).toStrictEqual([
        "scope-a",
        "scope-b",
      ]);
    });

    it("forwards contract definition privateProperties", async () => {
      let requestBody: any;
      nock("http://localhost:19193")
        .post("/management/v4/contractdefinitions", (body) => {
          requestBody = body;
          return true;
        })
        .reply(200, { "@id": "cd-id" });

      await v4Client.management.contractDefinitions.create({
        "@type": "ContractDefinition",
        "@id": "cd-id",
        accessPolicyId: "access",
        contractPolicyId: "contract",
        assetsSelector: [],
        privateProperties: { foo: "bar" },
      });

      expect(requestBody.privateProperties).toStrictEqual({ foo: "bar" });
    });
  });
});
