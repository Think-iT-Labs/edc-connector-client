import * as crypto from "node:crypto";
import {
  AssetInput,
  CatalogRequest,
  ContractDefinitionInput,
  DatasetRequest,
  EdcConnectorClient,
  PolicyBuilder,
  PolicyDefinitionInput,
} from "../../../src";
import { CatalogController } from "../../../src/controllers";

describe("CatalogController", () => {
  const providerProtocolUrl = "http://provider-connector:9194/protocol/2025-1";

  const v4Client = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .build();

  const providerManagement = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .build().management;

  const setupProviderAsset = async (): Promise<string> => {
    const assetInput: AssetInput = {
      "@type": "Asset",
      properties: {
        name: "product description",
        contenttype: "application/json",
      },
      dataAddress: {
        name: "Test asset",
        baseUrl: "https://jsonplaceholder.typicode.com/users",
        type: "HttpData",
      },
    };
    const idResponse = await providerManagement.assets.create(assetInput);

    const policyId = crypto.randomUUID();
    const policyInput: PolicyDefinitionInput = {
      id: policyId,
      policy: new PolicyBuilder()
        .type("Set")
        .raw({ permission: { action: "use" } })
        .build(),
    };
    await providerManagement.policyDefinitions.create(policyInput);

    const contractDefinitionInput: ContractDefinitionInput = {
      "@id": crypto.randomUUID(),
      accessPolicyId: policyId,
      contractPolicyId: policyId,
      assetsSelector: [],
    };
    await providerManagement.contractDefinitions.create(contractDefinitionInput);

    return idResponse.id;
  };

  const buildCatalogRequest = (): CatalogRequest => ({
    "@type": "CatalogRequest",
    counterPartyAddress: providerProtocolUrl,
    counterPartyId: "provider",
  });

  const buildDatasetRequest = (datasetId: string): DatasetRequest => ({
    "@type": "DatasetRequest",
    "@id": datasetId,
    counterPartyAddress: providerProtocolUrl,
    counterPartyId: "provider",
  });

  const runCatalogTests = (
    label: string,
    catalog: CatalogController,
  ): void => {
    describe(label, () => {
      describe("request", () => {
        it("returns the catalog for a target provider", async () => {
          await setupProviderAsset();

          const result = await catalog.request(buildCatalogRequest());

          expect(result).toHaveProperty("@type", [
            "http://www.w3.org/ns/dcat#Catalog",
          ]);
          expect(result).toHaveProperty("datasets");
        });
      });

      describe("requestDataset", () => {
        it("returns the dataset entries", async () => {
          await setupProviderAsset();

          const catalogResult = await catalog.request(buildCatalogRequest());

          const dataset = await catalog.requestDataset(
            buildDatasetRequest(catalogResult.datasets[0]["@id"]),
          );

          expect(dataset).toHaveProperty("@type", [
            "http://www.w3.org/ns/dcat#Dataset",
          ]);
        });
      });
    });
  };

  runCatalogTests("v4", v4Client.management.catalog);
});
