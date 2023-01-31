import * as crypto from "node:crypto";
import {
  Addresses,
  AssetInput,
  ContractDefinitionInput,
  EdcConnectorClient,
  PolicyDefinitionInput,
} from "../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../src/error";
import {
  createContractAgreement,
  createContractNegotiation,
  createReceiverServer,
  waitForNegotiationState,
} from "../test-utils";

jest.setTimeout(20000);

describe("DataController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191",
    data: "http://localhost:19193",
    ids: "http://consumer-connector:9194",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };
  const provider: Addresses = {
    default: "http://localhost:29191",
    data: "http://localhost:29193",
    ids: "http://provider-connector:9194",
    public: "http://localhost:29291",
    control: "http://localhost:29292",
  };

  describe("edcClient.data.createAsset", () => {
    it("succesfully creates an asset", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.deleteAsset", () => {
    it("deletes a target asset", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });

    it.todo("fails to delete an asset that is part of an agreed contract");
  });

  describe("edcClient.data.getAsset", () => {
    it("returns a target asset", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.listAssets", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.queryAllPolicies", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.deletePolicy", () => {
    it("deletes a target policy", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });

    it.todo("fails to delete a policy that is part of an agreed contract");
  });

  describe("edcClient.data.createContractDefinition", () => {
    it("succesfully creates a new contract definition", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.Duplicate,
        );
      });
    });
  });

  describe("edcClient.data.queryAllContractDefinitions", () => {
    it("succesfully retuns a list of contract definitions", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.deleteContractDefinition", () => {
    it("deletes a target contract definition", async () => {
      // given
      const edcClient = new EdcConnectorClient();
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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
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
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const assetId = crypto.randomUUID();

      edcClient.data.registerDataplane(consumerContext, {
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9192/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      });
      edcClient.data.registerDataplane(providerContext, {
        "id": "provider-dataplane",
        "url": "http://provider-connector:9192/control/transfer",
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
    /**
    TODO
    Automated "decline" test case
    - provider creates asset, ...
    - when consumer starts needs to specify the whole policy
    - if consumer changes the policy (e.g. remove permission)
      - provider will decline
    */

    it("kickstart a contract negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);

      // when
      const { createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // then
      expect(createResult).toHaveProperty("id");
      expect(createResult).toHaveProperty("createdAt");
    });
  });

  describe("edcClient.data.queryNegotiations", () => {
    it("retrieves all contract negotiations", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

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

    it("filters negotiations on the provider side based on agreements' assed ID", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId } = await createContractAgreement(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const [providerNegotiation] = await edcClient.data.queryNegotiations(
        providerContext,
        {
          filterExpression: [
            {
              operandLeft: "contractAgreement.assetId",
              operandRight: assetId,
              operator: "=",
            },
          ],
        },
      );

      // then
      expect(providerNegotiation).toBeTruthy();
    });
  });

  describe("edcClient.data.getNegotiation", () => {
    it("retrieves target contract negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.getNegotiationState", () => {
    it("returns the state of a target negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.data.cancelNegotiation", () => {
    it("cancel the a requested target negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const cancelledNegotiation = await edcClient.data.cancelNegotiation(
        consumerContext,
        createResult.id,
      );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        createResult.id,
        "ERROR",
      );

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
      const edcClient = new EdcConnectorClient();
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
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe.skip("edcClient.data.declineNegotiation", () => {
    it("declines the a requested target negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId, createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        createResult.id,
        "CONFIRMED",
      );

      const [providerNegotiation] = await edcClient.data.queryNegotiations(
        providerContext,
        {
          filterExpression: [
            {
              operandLeft: "contractAgreement.assetId",
              operandRight: assetId,
              operator: "=",
            },
          ],
        },
      );

      // when
      await edcClient.data.declineNegotiation(
        providerContext,
        providerNegotiation.id,
      );

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        createResult.id,
        "DECLINED",
      );

      const declinedProviderNegotiation = await edcClient.data.getNegotiation(
        consumerContext,
        createResult.id,
      );

      // then
      expect(declinedProviderNegotiation).toHaveProperty("state", "DECLINED");
    });
  });

  describe("edcClient.data.getAgreementForNegotiation", () => {
    it("returns the a agreement for a target negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId, createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        createResult.id,
        "CONFIRMED",
      );

      // when
      const contractAgreement = await edcClient.data
        .getAgreementForNegotiation(
          consumerContext,
          createResult.id,
        );

      // then
      expect(contractAgreement).toHaveProperty(
        "assetId",
        assetId,
      );
    });
  });

  describe("edcClient.data.queryAllAgreements", () => {
    it("retrieves all contract agreements", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { createResult } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        createResult.id,
        "CONFIRMED",
      );
      const contractNegotiation = await edcClient.data.getNegotiation(
        consumerContext,
        createResult.id,
      );

      // when
      const contractAgreements = await edcClient.data.queryAllAgreements(
        consumerContext,
      );

      // then
      expect(contractAgreements.length).toBeGreaterThan(0);
      expect(
        contractAgreements.find((contractAgreement) =>
          contractAgreement.id === contractNegotiation.contractAgreementId
        ),
      ).toBeTruthy();
    });
  });

  describe("edcClient.data.getAgreement", () => {
    it("retrieves target contract agreement", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);

      // when
      const { contractNegotiation, contractAgreement } =
        await createContractAgreement(
          edcClient,
          providerContext,
          consumerContext,
        );

      // then
      expect(contractAgreement).toHaveProperty(
        "id",
        contractNegotiation.contractAgreementId,
      );
    });

    it("fails to fetch an not existant contract negotiation", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.data.getAgreement(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects
        .toThrowError(
          "resource not found",
        );

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("with receiver server", () => {
    const receiverServer = createReceiverServer();

    beforeAll(async () => {
      await receiverServer.listen();
    });

    afterAll(async () => {
      await receiverServer.shutdown();
    });

    describe("edcClient.data.initiateTransfer", () => {
      it("initiate the transfer process", async () => {
        // given
        const edcClient = new EdcConnectorClient();
        const consumerContext = edcClient.createContext(apiToken, consumer);
        const providerContext = edcClient.createContext(apiToken, provider);
        const { assetId, contractAgreement } = await createContractAgreement(
          edcClient,
          providerContext,
          consumerContext,
        );

        const receiverCallback = receiverServer.waitForEvent(
          contractAgreement.id,
        );

        // when
        const createResult = await edcClient.data.initiateTransfer(
          consumerContext,
          {
            assetId,
            "connectorId": "provider",
            "connectorAddress": `${providerContext.ids}/api/v1/ids/data`,
            "contractId": contractAgreement.id,
            "managedResources": false,
            "dataDestination": { "type": "HttpProxy" },
          },
        );

        await receiverCallback;

        // then
        expect(createResult).toHaveProperty("createdAt");
        expect(createResult).toHaveProperty("id");
      });
    });

    describe("edcClient.data.queryAllTransferProcesses", () => {
      it("retrieves all tranfer processes", async () => {
        // given
        const edcClient = new EdcConnectorClient();
        const consumerContext = edcClient.createContext(apiToken, consumer);
        const providerContext = edcClient.createContext(apiToken, provider);
        const { assetId, contractAgreement } = await createContractAgreement(
          edcClient,
          providerContext,
          consumerContext,
        );

        const receiverCallback = receiverServer.waitForEvent(
          contractAgreement.id,
        );

        const createResult = await edcClient.data.initiateTransfer(
          consumerContext,
          {
            assetId,
            "connectorId": "provider",
            "connectorAddress": `${providerContext.ids}/api/v1/ids/data`,
            "contractId": contractAgreement.id,
            "managedResources": false,
            "dataDestination": { "type": "HttpProxy" },
          },
        );

        await receiverCallback;

        // when
        const transferProcesses = await edcClient.data
          .queryAllTransferProcesses(
            consumerContext,
          );

        // then
        expect(transferProcesses.length).toBeGreaterThan(0);
        expect(
          transferProcesses.find((transferProcess) =>
            createResult.id === transferProcess.id
          ),
        ).toBeTruthy();
      });
    });
  });

  describe("edcClient.data.registerDataplane", () => {
    it("succesfully register a dataplane", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const context = edcClient.createContext(apiToken, consumer);
      const dataplaneInput = {
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9192/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      };

      // when
      const registration = await edcClient.data.registerDataplane(
        context,
        dataplaneInput,
      );

      // then
      expect(registration).toBeUndefined();
    });
  });

  describe("edcClient.data.listDataplanes", () => {
    it("succesfully list available dataplanes", async () => {
      // given
      const edcClient = new EdcConnectorClient();
      const context = edcClient.createContext(apiToken, consumer);
      const dataplaneInput = {
        "id": "consumer-dataplane",
        "url": "http://consumer-connector:9192/control/transfer",
        "allowedSourceTypes": ["HttpData"],
        "allowedDestTypes": ["HttpProxy", "HttpData"],
        "properties": {
          "publicApiUrl": "http://consumer-connector:9291/public/",
        },
      };
      await edcClient.data.registerDataplane(
        context,
        dataplaneInput,
      );

      // when
      const dataplanes = await edcClient.data.listDataplanes(context);

      // then
      expect(dataplanes.length).toBeGreaterThan(0);
      dataplanes.forEach((dataplane) => {
        expect(dataplane).toHaveProperty("id", dataplaneInput.id);
        expect(dataplane).toHaveProperty("url", dataplaneInput.url);
        expect(dataplane).toHaveProperty(
          "allowedDestTypes",
          dataplaneInput.allowedDestTypes,
        );
        expect(dataplane).toHaveProperty(
          "allowedSourceTypes",
          dataplaneInput.allowedSourceTypes,
        );
        expect(dataplane).toHaveProperty(
          "properties",
          dataplaneInput.properties,
        );
      });
    });
  });
});
