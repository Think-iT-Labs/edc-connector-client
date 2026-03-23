import * as crypto from "node:crypto";
import {
  AssetInput,
  AssetInputV3,
  AssetInputV4,
  ContractDefinitionInput,
  EdcConnectorClient,
  MANAGEMENT_API_VERSIONS,
  ManagementApiVersion,
  PolicyBuilder,
  PolicyDefinitionInput,
} from "../../../src";

describe.each<ManagementApiVersion>(MANAGEMENT_API_VERSIONS)(
  "CatalogController (%s)",
  (apiVersion) => {
    const providerProtocolUrl =
      "http://provider-connector:9194/protocol/2025-1";

    const consumerManagement = new EdcConnectorClient.Builder()
      .apiToken("123456")
      .managementUrl("http://localhost:19193/management")
      .managementApiVersion(apiVersion)
      .build().management;

    const providerManagement = new EdcConnectorClient.Builder()
      .apiToken("123456")
      .managementUrl("http://localhost:29193/management")
      .managementApiVersion(apiVersion)
      .build().management;

    describe("request", () => {
      it("returns the catalog for a target provider", async () => {
        // given
        let assetInput: AssetInput;
        if (apiVersion === "v3") {
          assetInput = {
            version: "v3",
            properties: {
              name: "product description",
              contenttype: "application/json",
            },
            dataAddress: {
              name: "Test asset",
              baseUrl: "https://jsonplaceholder.typicode.com/users",
              type: "HttpData",
            },
          } satisfies AssetInputV3;
        } else {
          assetInput = {
            version: "v4",
            "@type": "Asset",
            properties: {
              name: "product description",
              contenttype: "application/json",
            },
            dataplaneMetadata: {
              "@type": "@type",
              properties: {
                name: "Test asset",
                baseUrl: "https://jsonplaceholder.typicode.com/users",
                type: "HttpData",
              },
            },
          } satisfies AssetInputV4;
        }
        await providerManagement.assets.create(assetInput);

        const policyId = crypto.randomUUID();
        const policyInput: PolicyDefinitionInput = {
          id: policyId,
          "@type": "PolicyDefinition",
          policy: new PolicyBuilder()
            .type("Set")
            .raw({
              permission: {
                action: "use",
              },
            })
            .build(),
        };
        await providerManagement.policyDefinitions.create(policyInput);

        const contractDefinitionId = crypto.randomUUID();
        const contractDefinitionInput: ContractDefinitionInput = {
          "@type": "ContractDefinition",
          "@id": contractDefinitionId,
          accessPolicyId: policyId,
          contractPolicyId: policyId,
          assetsSelector: [],
        };
        await providerManagement.contractDefinitions.create(
          contractDefinitionInput,
        );

        // when
        const catalog = await consumerManagement.catalog.request({
          "@type": "CatalogRequest",
          counterPartyAddress: providerProtocolUrl,
          counterPartyId: "provider",
        });

        // then
        expect(catalog).toHaveProperty("@type", [
          "http://www.w3.org/ns/dcat#Catalog",
        ]);
        expect(catalog).toHaveProperty("datasets");
      });
    });

    describe("requestDataset", () => {
      it("returns the dataset entries", async () => {
        // given
        let assetInput: AssetInput;
        if (apiVersion === "v3") {
          assetInput = {
            version: "v3",
            properties: {
              name: "product description",
              contenttype: "application/json",
            },
            dataAddress: {
              name: "Test asset",
              baseUrl: "https://jsonplaceholder.typicode.com/users",
              type: "HttpData",
            },
          } satisfies AssetInputV3;
        } else {
          assetInput = {
            version: "v4",
            "@type": "Asset",
            properties: {
              name: "product description",
              contenttype: "application/json",
            },
            dataplaneMetadata: {
              "@type": "@type",
              properties: {
                name: "Test asset",
                baseUrl: "https://jsonplaceholder.typicode.com/users",
                type: "HttpData",
              },
            },
          } satisfies AssetInputV4;
        }

        await providerManagement.assets.create(assetInput);

        const policyId = crypto.randomUUID();
        const policyInput: PolicyDefinitionInput = {
          id: policyId,
          "@type": "PolicyDefinition",
          policy: new PolicyBuilder()
            .type("Set")
            .raw({
              permission: {
                action: "use",
              },
            })
            .build(),
        };
        await providerManagement.policyDefinitions.create(policyInput);

        const contractDefinitionId = crypto.randomUUID();
        const contractDefinitionInput: ContractDefinitionInput = {
          "@id": contractDefinitionId,
          "@type": "ContractDefinition",
          accessPolicyId: policyId,
          contractPolicyId: policyId,
          assetsSelector: [],
        };
        await providerManagement.contractDefinitions.create(
          contractDefinitionInput,
        );
        const catalog = await consumerManagement.catalog.request({
          "@type": "CatalogRequest",
          counterPartyAddress: providerProtocolUrl,
          counterPartyId: "provider",
        });

        // when
        const catalogDataset = await consumerManagement.catalog.requestDataset({
          "@type": "DatasetRequest",
          counterPartyAddress: providerProtocolUrl,
          counterPartyId: "provider",
          "@id": catalog.datasets[0]["@id"],
        });

        // then
        expect(catalogDataset).toHaveProperty("@type", [
          "http://www.w3.org/ns/dcat#Dataset",
        ]);
      });
    });
  },
);
