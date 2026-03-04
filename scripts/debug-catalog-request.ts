import { EdcConnectorClient } from "../src";

const MANAGEMENT_URL =
  process.env.MANAGEMENT_URL ||
  "https://mds-think-it-1.dataspaces.think-it.io/api/management";

const API_TOKEN = process.env.API_TOKEN || "MyApiKey";

const rotterdamClient = new EdcConnectorClient({
  addresses: {
    management: MANAGEMENT_URL,
  },
  token: API_TOKEN,
});

async function main() {
  // Intercept fetch to log the request body
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(input, init);

    const url = request.url;
    const method = request.method;
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Clone to read body without consuming it
    const cloned = request.clone();
    const body = await cloned.text();

    console.log("=== REQUEST ===");
    console.log("URL:", url);
    console.log("Method:", method);
    console.log("Headers:", JSON.stringify(headers, null, 2));
    console.log("Body:", JSON.stringify(JSON.parse(body), null, 2));
    console.log("===============\n");

    return originalFetch(input, init);
  };

  try {
    const catalog = await rotterdamClient.management.catalog.request({
      counterPartyAddress:
        "https://mds-think-it-2.dataspaces.think-it.io/api/dsp/2025-1",
      counterPartyId:
        "did:web:mds-think-it-2.dataspaces.think-it.io",
      querySpec: {
        limit: 10000,
        offset: 0,
      },
    });

    console.log("=== RESPONSE ===");
    console.log("Catalog ID:", catalog.id);
    console.log("Participant ID:", catalog.participantId);
    console.log("Datasets count:", catalog.datasets.length);
    console.log("================");
  } catch (error) {
    console.error("=== ERROR ===");
    console.error(error);
    console.error("==============");
  }
}

main();