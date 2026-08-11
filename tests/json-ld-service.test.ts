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
});
