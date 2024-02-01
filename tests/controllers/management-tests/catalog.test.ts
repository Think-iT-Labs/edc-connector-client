import * as crypto from "node:crypto";
import {
  AssetInput,
  ContractDefinitionInput,
  EdcConnectorClient,
  PolicyDefinitionInput,
} from "../../../src";

describe("CatalogController", () => {
  const providerProtocolUrl = "http://provider-connector:9194/protocol";

  const consumerManagement = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build()
    .management;

  const providerManagement = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .build()
    .management;

  describe("request", () => {
    it("returns the catalog for a target provider", async () => {
      // given
      const assetInput: AssetInput = {
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
      await providerManagement.assets.create(assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          uid: "231802-bb34-11ec-8422-0242ac120002",
          permission: [
            {
              action: "use"
            },
          ],
        },
      };
      await providerManagement.policyDefinitions.create(policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        assetsSelector: [],
      };
      await providerManagement.contractDefinitions.create(
        contractDefinitionInput,
      );

      // when
      const catalog = await consumerManagement.catalog.request(
        {
          counterPartyAddress: providerProtocolUrl,
        },
      );

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
      const assetInput: AssetInput = {
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
      await providerManagement.assets.create(assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          uid: "231802-bb34-11ec-8422-0242ac120002",
          permission: [
            {
              action: "use"
            },
          ],
        },
      };
      await providerManagement.policyDefinitions.create(policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        assetsSelector: [],
      };
      await providerManagement.contractDefinitions.create(
        contractDefinitionInput,
      );
      const catalog = await consumerManagement.catalog.request(
        {
          counterPartyAddress: providerProtocolUrl,
        },
      );

      // when
      const catalogDataset = await consumerManagement.catalog.requestDataset(
        {
          counterPartyAddress: providerProtocolUrl,
          "@id": catalog.datasets[0]["@id"]
        },
      );

      // then
      expect(catalogDataset).toHaveProperty("@type", [
        "http://www.w3.org/ns/dcat#Dataset",
      ]);
    });
  });
});
