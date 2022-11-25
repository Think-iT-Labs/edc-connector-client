import * as crypto from "node:crypto";
import {
  Addresses,
  AssetInput,
  ContractDefinitionInput,
  EdcClient,
  PolicyDefinitionInput,
} from "../../src";
import { EdcClientError, EdcClientErrorType } from "../../src/error";

describe("DataController", () => {
  const apiToken = "123456";
  const addresses: Addresses = {
    default: "http://localhost:19191",
    validation: "http://localhost:19192",
    data: "http://localhost:19193",
    ids: "http://localhost:19194",
    dataplane: "http://localhost:19195",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };

  describe("edcClient.data.createAsset", () => {
    it("succesfully creates an asset", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);

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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);

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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);

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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);

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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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
      const context = edcClient.createContext(apiToken, addresses);
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

    it("fails to fetch an not existant policy", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

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

  describe("edcClient.data.deleteContractDefinition", () => {
    it("deletes a target contract definition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);
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

    it("fails to delete an not existant contractDefinition", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

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
});
