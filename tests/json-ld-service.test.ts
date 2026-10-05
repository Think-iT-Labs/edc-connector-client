import jsonld from "jsonld";
import { JsonLdService } from "../src";

describe("JsonLdService", () => {
  it("expands a JSON-LD document using a cached context", async () => {
    const contextUrl = "https://custom.example.com/context.jsonld";
    const service = new JsonLdService({
      [contextUrl]: {
        "@context": { name: "https://schema.org/name" },
      },
    });

    const result = await service.expand(
      { "@context": contextUrl, name: "test" },
      () => ({ "https://schema.org/name": [{ "@value": "" }] } as any),
    );

    expect(result["https://schema.org/name"]).toStrictEqual([{ "@value": "test" }]);
  });

  it("without cached contexts behaves like the default loader", async () => {
    const serviceDefault = new JsonLdService();
    const serviceEmpty = new JsonLdService({});

    const body = [{ "@id": "https://example.com/resource", "@type": ["https://example.com/Type"] }];

    const resultDefault = await serviceDefault.expandArray(body, () => ({} as any));
    const resultEmpty = await serviceEmpty.expandArray(body, () => ({} as any));

    expect(resultDefault).toStrictEqual(resultEmpty);
  });

  it("fetches a remote context once and serves later lookups from the in-memory cache", async () => {
    const contextUrl = "https://remote.example.com/context.jsonld";
    const context = { "@context": { name: "https://schema.org/name" } };

    let fetchCount = 0;
    const loaders = (jsonld as any).documentLoaders;
    const originalNode = loaders.node;
    loaders.node = () => async (url: string) => {
      fetchCount++;
      return { contextUrl: null, documentUrl: url, document: context };
    };

    try {
      const service = new JsonLdService();

      const first = await service.expand(
        { "@context": contextUrl, name: "first" },
        () => ({} as any),
      );
      const second = await service.expand(
        { "@context": contextUrl, name: "second" },
        () => ({} as any),
      );

      expect(first["https://schema.org/name"]).toStrictEqual([{ "@value": "first" }]);
      expect(second["https://schema.org/name"]).toStrictEqual([{ "@value": "second" }]);
      expect(fetchCount).toBe(1);
    } finally {
      loaders.node = originalNode;
    }
  });
});
