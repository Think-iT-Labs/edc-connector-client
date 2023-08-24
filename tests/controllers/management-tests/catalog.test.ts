import * as crypto from "node:crypto";
import {
  AssetInput,
  ContractDefinitionInput,
  EdcConnectorClientBuilder,
  PolicyDefinitionInput,
} from "../../../src";

describe("CatalogController", () => {
  const providerProtocolUrl = "http://provider-connector:9194/protocol";

  const consumerManagement = new EdcConnectorClientBuilder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build()
    .management;

  const providerManagement = new EdcConnectorClientBuilder()
    .apiToken("123456")
    .managementUrl("http://localhost:29193/management")
    .build()
    .management;

  describe("queryAll", () => {
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
          permissions: [
            {
              action: {
                type: "USE",
              },
              edctype: "dataspaceconnector:permission",
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
          providerUrl: providerProtocolUrl,
        },
      );

      // then
      expect(catalog).toHaveProperty("@type", [
        "https://www.w3.org/ns/dcat/Catalog",
      ]);
      expect(catalog).toHaveProperty("datasets");
    });
  });
});
