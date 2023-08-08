import * as crypto from "node:crypto";
import {
  Addresses,
  AssetInput,
  ContractDefinitionInput,
  EdcConnectorClient,
  PolicyDefinitionInput,
} from "../../../src";

describe("ManagementController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191/api",
    management: "http://localhost:19193/management",
    protocol: "http://consumer-connector:9194/protocol",
    public: "http://localhost:19291/public",
    control: "http://localhost:19292/control",
  };
  const provider: Addresses = {
    default: "http://localhost:29191/api",
    management: "http://localhost:29193/management",
    protocol: "http://provider-connector:9194/protocol",
    public: "http://localhost:29291/public",
    control: "http://localhost:29292/control",
  };

  const edcClient = new EdcConnectorClient();

  describe("edcClient.management.catalog.queryAll", () => {
    it("returns the catalog for a target provider", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      const assetInput: AssetInput = {
        "@id": assetId,
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
      await edcClient.management.assets.create(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          uid: "231802-bb34-11ec-8422-0242ac120002",
          permissions: [
            {
              target: assetId,
              action: {
                type: "USE",
              },
              edctype: "dataspaceconnector:permission",
            },
          ],
        },
      };
      await edcClient.management.policyDefinitions.create(
        providerContext,
        policyInput,
      );

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        assetsSelector: [],
      };
      await edcClient.management.contractDefinitions.create(
        providerContext,
        contractDefinitionInput,
      );

      // when
      const catalog = await edcClient.management.catalog.queryAll(
        consumerContext,
        {
          providerUrl: provider.protocol,
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
