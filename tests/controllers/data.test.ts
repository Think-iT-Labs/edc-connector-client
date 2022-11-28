import * as crypto from "node:crypto";
import {
  Addresses,
  AssetInput,
  ContractDefinitionInput,
  ContractOffer,
  EdcClient,
  Policy,
  PolicyDefinitionInput,
} from "../../src";
import { EdcClientError, EdcClientErrorType } from "../../src/error";

jest.setTimeout(20000);

describe("DataController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191",
    validation: "http://localhost:19192",
    data: "http://localhost:19193",
    ids: "http://consumer-connector:9194",
    dataplane: "http://localhost:19195",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };
  const provider: Addresses = {
    default: "http://localhost:29191",
    validation: "http://localhost:29192",
    data: "http://localhost:29193",
    ids: "http://provider-connector:9194",
    dataplane: "http://localhost:29195",
    public: "http://localhost:29291",
    control: "http://localhost:29292",
  };

  describe("edcClient.data.createAsset", () => {
    it("succesfully creates an asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };

      // when
      const createResult = await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // then
      expect(createResult).toHaveProperty("createdAt");
      expect(createResult).toHaveProperty("id");
    });

    it("fails creating two assets with the same id", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };

      // when
      await edcClient.data.createAsset(
        context,
        assetInput,
      );
      const maybeCreateResult = edcClient.data.createAsset(
        context,
        assetInput,
      );

      // then
      await expect(maybeCreateResult).rejects
        .toThrowError(
          "duplicated resource",
        );

      maybeCreateResult.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.deleteAsset", () => {
    it("deletes a target asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // when
      const asset = await edcClient.data.deleteAsset(
        context,
        assetInput.asset.properties["asset:prop:id"],
      );

      // then
      expect(asset).toBeUndefined();
    });

    it("fails to delete an not existant asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.deleteAsset(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });

    it.todo("fails to delete an asset that is part of an agreed contract");
  });

  describe("edcClient.data.getAsset", () => {
    it("returns a target asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // when
      const asset = await edcClient.data.getAsset(
        context,
        assetInput.asset.properties["asset:prop:id"],
      );

      // then
      expect(asset).toHaveProperty("createdAt");
      expect(asset).toHaveProperty(
        "id",
        assetInput.asset.properties["asset:prop:id"],
      );
    });

    it("fails to fetch an not existant asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.getAsset(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.listAssets", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": crypto.randomUUID(),
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(
        context,
        assetInput,
      );

      // when
      const assets = await edcClient.data.listAssets(
        context,
      );

      // then
      expect(assets.length).toBeGreaterThan(0);
      expect(
        assets.find((asset) =>
          asset.properties["asset:prop:id"] ===
            assetInput.asset.properties["asset:prop:id"]
        ),
      ).toBeTruthy();
    });
  });

  describe("edcClient.data.createPolicy", () => {
    it("succesfully creates a new policy", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        id: crypto.randomUUID(),
        policy: {},
      };

      // when
      const createResult = await edcClient.data.createPolicy(
        context,
        policyInput,
      );

      // then
      expect(createResult).toHaveProperty("createdAt");
      expect(createResult).toHaveProperty("id");
    });

    it("fails creating two policies with the same id", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        id: crypto.randomUUID(),
        policy: {},
      };

      // when
      await edcClient.data.createPolicy(
        context,
        policyInput,
      );
      const maybeCreateResult = edcClient.data.createPolicy(
        context,
        policyInput,
      );

      // then
      await expect(maybeCreateResult).rejects
        .toThrowError(
          "duplicated resource",
        );

      maybeCreateResult.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.queryAllPolicies", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        id: crypto.randomUUID(),
        policy: {},
      };
      await edcClient.data.createPolicy(
        context,
        policyInput,
      );

      // when
      const policies = await edcClient.data.queryAllPolicies(
        context,
      );

      // then
      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy.id === policyInput.id),
      ).toBeTruthy();
    });
  });

  describe("edcClient.data.getPolicy", () => {
    it("succesfully retuns a target policy", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        id: crypto.randomUUID(),
        policy: {},
      };
      const createResult = await edcClient.data.createPolicy(
        context,
        policyInput,
      );

      // when
      const policy = await edcClient.data.getPolicy(
        context,
        createResult.id,
      );

      // then
      expect(policy.id).toBe(createResult.id);
    });

    it("fails to fetch an not existant policy", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybePolicy = edcClient.data.getPolicy(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybePolicy).rejects
        .toThrowError(
          "resource not found",
        );

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.deletePolicy", () => {
    it("deletes a target policy", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        id: crypto.randomUUID(),
        policy: {},
      };
      await edcClient.data.createPolicy(
        context,
        policyInput,
      );

      // when
      const policy = await edcClient.data.deletePolicy(
        context,
        policyInput.id!,
      );

      // then
      expect(policy).toBeUndefined();
    });

    it("fails to delete an not existant policy", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.deletePolicy(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });

    it.todo("fails to delete a policy that is part of an agreed contract");
  });

  describe("edcClient.data.createContractDefinition", () => {
    it("succesfully creates a new contract definition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        id: crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        criteria: [],
      };

      // when
      const createResult = await edcClient.data.createContractDefinition(
        context,
        contractDefinitionInput,
      );

      // then
      expect(createResult).toHaveProperty("createdAt");
      expect(createResult).toHaveProperty("id");
    });

    it("fails creating two contract definitions with the same id", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        id: crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        criteria: [],
      };

      // when
      await edcClient.data.createContractDefinition(
        context,
        contractDefinitionInput,
      );
      const maybeCreateResult = edcClient.data.createContractDefinition(
        context,
        contractDefinitionInput,
      );

      // then
      await expect(maybeCreateResult).rejects
        .toThrowError(
          "duplicated resource",
        );

      maybeCreateResult.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.queryAllContractDefinitions", () => {
    it("succesfully retuns a list of contract definitions", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        id: crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        context,
        contractDefinitionInput,
      );

      // when
      const policies = await edcClient.data.queryAllContractDefinitions(
        context,
      );

      // then
      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy.id === contractDefinitionInput.id),
      ).toBeTruthy();
    });
  });

  describe("edcClient.data.getContractDefinition", () => {
    it("succesfully retuns a target contract definition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        id: crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        criteria: [],
      };
      const createResult = await edcClient.data.createContractDefinition(
        context,
        contractDefinitionInput,
      );

      // when
      const contractDefinition = await edcClient.data.getContractDefinition(
        context,
        createResult.id,
      );

      // then
      expect(contractDefinition.id).toBe(createResult.id);
    });

    it("fails to fetch an not existant contract definition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybePolicy = edcClient.data.getContractDefinition(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybePolicy).rejects
        .toThrowError(
          "resource not found",
        );

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.deleteContractDefinition", () => {
    it("deletes a target contract definition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        id: crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        criteria: [],
      };
      const createResult = await edcClient.data.createContractDefinition(
        context,
        contractDefinitionInput,
      );

      // when
      const contractDefinition = await edcClient.data.deleteContractDefinition(
        context,
        createResult.id,
      );

      // then
      expect(contractDefinition).toBeUndefined();
    });

    it("fails to delete an not existant contract definition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeContractDefinition = edcClient.data.deleteContractDefinition(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeContractDefinition).rejects
        .toThrowError(
          "resource not found",
        );

      maybeContractDefinition.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });

    it.todo(
      "fails to delete a contract definition that is part of an agreed contract",
    );
  });

  describe("edcClient.data.requestCatalog", () => {
    it("returns the catalog for a target provider", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      // when
      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      // then
      expect(catalog).toHaveProperty("id", "default");
      expect(catalog).toHaveProperty("contractOffers");
    });
  });

  describe("edcClient.data.initiateContractNegotiation", () => {
    it("kickstart a contract negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      // when
      const createResult = await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      // then
      expect(createResult).toHaveProperty("id");
      expect(createResult).toHaveProperty("createdAt");
    });
  });

  describe("edcClient.data.queryNegotiations", () => {
    it("retrieves all contract negotiations", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      const createResult = await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      // when
      const contractNegotiations = await edcClient.data.queryNegotiations(
        consumerContext,
      );

      // then
      expect(contractNegotiations.length).toBeGreaterThan(0);
      expect(
        contractNegotiations.find((contractNegotiation) =>
          contractNegotiation.id === createResult.id
        ),
      ).toBeTruthy();
    });
  });

  describe("edcClient.data.getNegotiation", () => {
    it("retrieves target contract negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      const createResult = await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      // when
      const contractNegotiation = await edcClient.data.getNegotiation(
        consumerContext,
        createResult.id,
      );

      // then
      expect(contractNegotiation).toHaveProperty("id", createResult.id);
    });

    it("fails to fetch an not existant contract negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.getNegotiation(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.getNegotiationState", () => {
    it("returns the state of a target negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      const createResult = await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      // when
      const contractNegotiationState = await edcClient.data.getNegotiationState(
        consumerContext,
        createResult.id,
      );

      // then
      expect(contractNegotiationState).toHaveProperty("state");
    });

    it("fails to fetch an not existant contract negotiation's state", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.getNegotiationState(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.cancelNegotiation", () => {
    it("cancel the a requested target negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      const createResult = await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      // when
      const cancelledNegotiation = await edcClient.data.cancelNegotiation(
        consumerContext,
        createResult.id,
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const contractNegotiation = await edcClient.data.getNegotiationState(
        consumerContext,
        createResult.id,
      );

      // then
      expect(cancelledNegotiation).toBeUndefined();
      expect(contractNegotiation).toHaveProperty("state", "ERROR");
    });

    it("fails to cancel an not existant contract negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.cancelNegotiation(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });

  describe.skip("edcClient.data.declineNegotiation", () => {
    it("declines the a requested target negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      const providerNegotiations = await edcClient.data.queryNegotiations(
        providerContext,
      );

      const providerNegotiation = providerNegotiations.find((negotiation) =>
        !["CONFIRMED", "DECLINED"].includes(negotiation.state)
      );

      expect(providerNegotiation).toBeTruthy();

      // when
      const delinedNegotiation = await edcClient.data.declineNegotiation(
        providerContext,
        providerNegotiation!.id,
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const contractNegotiation = await edcClient.data.getNegotiationState(
        providerContext,
        providerNegotiation!.id,
      );

      // then
      expect(delinedNegotiation).toBeUndefined();
      expect(contractNegotiation).toHaveProperty("state", "DECLINED");
    });
  });

  describe.skip("edcClient.data.getAgreementForNegotiation", () => {
    it("returns the a agreement for a target negotiation", async () => {
      // given
      const edcClient = new EdcClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.dataplane.registerDataplane(consumerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.dataplane.registerDataplane(providerContext, {
        "edctype": "dataspaceconnector:dataplaneinstance",
        "id": "provider-dataplane",
        "url": "http://provider-connector:9292/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://provider-connector:9291/public/",
        },
      });

      const assetInput: AssetInput = {
        asset: {
          properties: {
            "asset:prop:id": assetId,
            "asset:prop:name": "product description",
            "asset:prop:contenttype": "application/json",
          },
        },
        dataAddress: {
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
            type: "HttpData",
          },
        },
      };
      await edcClient.data.createAsset(providerContext, assetInput);

      const policyId = crypto.randomUUID();
      const policyInput: PolicyDefinitionInput = {
        id: policyId,
        policy: {
          "uid": "231802-bb34-11ec-8422-0242ac120002",
          "permissions": [
            {
              "target": assetId,
              "action": {
                "type": "USE",
              },
              "edctype": "dataspaceconnector:permission",
            },
          ],
          "@type": {
            "@policytype": "set",
          },
        },
      };
      await edcClient.data.createPolicy(providerContext, policyInput);

      const contractDefinitionId = crypto.randomUUID();
      const contractDefinitionInput: ContractDefinitionInput = {
        id: contractDefinitionId,
        accessPolicyId: policyId,
        contractPolicyId: policyId,
        criteria: [],
      };
      await edcClient.data.createContractDefinition(
        providerContext,
        contractDefinitionInput,
      );

      const catalog = await edcClient.data.requestCatalog(consumerContext, {
        providerUrl: `${provider.ids}/api/v1/ids/data`,
      });

      const contractOffer = catalog.contractOffers.find((offer) =>
        offer.asset?.id === assetId
      ) as ContractOffer;

      const createResult = await edcClient.data
        .initiateContractNegotiation(consumerContext, {
          connectorAddress: `${provider.ids}/api/v1/ids/data`,
          connectorId: "provider",
          offer: {
            offerId: contractOffer.id as string,
            assetId,
            policy: contractOffer.policy as Policy,
          },
          protocol: "ids-multipart",
        });

      // when
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const contractNegotiation = await edcClient.data
        .getAgreementForNegotiation(
          providerContext,
          createResult.id,
        );

      // then
      expect(contractNegotiation).toHaveProperty("state", "CONFIRMED");
    });
  });
});
