import * as crypto from "node:crypto";
import {
  Addresses,
  AssetInput,
  ContractDefinitionInput,
  EDC_NAMESPACE,
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

  describe("edcClient.management.assetController.create", () => {
    it("succesfully creates an asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };

      // when
      const idResponse = await edcClient.management.assetController.create(
        context,
        assetInput,
      );

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
    });

    it("fails creating two assets with the same id", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };

      // when
      await edcClient.management.assetController.create(context, assetInput);
      const maybeCreateResult = edcClient.management.assetController.create(
        context,
        assetInput,
      );

      // then
      await expect(maybeCreateResult).rejects.toThrowError(
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

  describe("edcClient.management.delete", () => {
    it("deletes a target asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await edcClient.management.assetController.create(context, assetInput);

      // when
      const asset = await edcClient.management.assetController.delete(
        context,
        assetInput["@id"] as string,
      );

      // then
      expect(asset).toBeUndefined();
    });

    it("fails to delete an not existant asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.assetController.delete(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

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

  describe("edcClient.management.get", () => {
    it("returns a target asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await edcClient.management.assetController.create(context, assetInput);

      // when
      const asset = await edcClient.management.assetController.get(
        context,
        assetInput["@id"] as string,
      );

      // then
      expect(asset).toHaveProperty("@context");
      expect(asset).toHaveProperty("@id", assetInput["@id"]);
    });

    it("fails to fetch an not existant asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.assetController.get(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.queryAllAssets", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput: AssetInput = {
        "@id": crypto.randomUUID(),
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
      await edcClient.management.assetController.create(context, assetInput);

      // when
      const assets = await edcClient.management.assetController.queryAllAssets(
        context,
      );

      // then
      expect(assets.length).toBeGreaterThan(0);
      expect(
        assets.find((asset) => asset?.["@id"] === assetInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("edcClient.management.updateAsset", () => {
    it("updates a target asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const assetInput = {
        "@id": crypto.randomUUID(),
        properties: {
          name: "product description",
          contenttype: "application/json",
        },
        dataAddress: {
          type: "HttpData",
          properties: {
            name: "Test asset",
            baseUrl: "https://jsonplaceholder.typicode.com/users",
          },
        },
      };
      await edcClient.management.createAsset(context, assetInput);
      const updateAssetInput = {
        "@id": assetInput["@id"],
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: {
          type: "s3",
        },
      };

      // when
      await edcClient.management.updateAsset(context, updateAssetInput);

      const updatedAsset = await edcClient.management.getAsset(
        context,
        assetInput["@id"],
      );

      // then
      expect(updatedAsset).toHaveProperty("@type");
      expect(updatedAsset).toEqual(
        expect.objectContaining({
          [`${EDC_NAMESPACE}:properties`]: {
            [`${EDC_NAMESPACE}:name`]: updateAssetInput.properties.name,
            [`${EDC_NAMESPACE}:id`]: updateAssetInput["@id"],
            [`${EDC_NAMESPACE}:contenttype`]:
              updateAssetInput.properties.contenttype,
          },
          [`${EDC_NAMESPACE}:dataAddress`]: {
            [`${EDC_NAMESPACE}:type`]: updateAssetInput.dataAddress.type,
            "@type": "edc:DataAddress",
          },
        }),
      );
    });

    it("fails to update an inexistant asset", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const updateAssetInput = {
        "@id": crypto.randomUUID(),
        properties: { name: "updated test asset", contenttype: "text/plain" },
        dataAddress: {
          type: "s3",
        },
      };

      // when
      const maybeUpdatedAsset = edcClient.management.updateAsset(
        context,
        updateAssetInput,
      );

      // then
      await expect(maybeUpdatedAsset).rejects.toThrowError(
        "resource not found",
      );

      maybeUpdatedAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.createPolicy", () => {
    it("succesfully creates a new policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };

      // when
      const idResponse =
        await edcClient.management.policyDefinitionController.create(
          context,
          policyInput,
        );

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
    });

    it("fails creating two policies with the same id", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };

      // when
      await edcClient.management.policyDefinitionController.create(
        context,
        policyInput,
      );
      const maybeCreateResult =
        edcClient.management.policyDefinitionController.create(
          context,
          policyInput,
        );

      // then
      await expect(maybeCreateResult).rejects.toThrowError(
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

  describe("edcClient.management.policyDefinitionController.queryAll", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await edcClient.management.policyDefinitionController.create(
        context,
        policyInput,
      );

      // when
      const policies =
        await edcClient.management.policyDefinitionController.queryAll(context);

      // then
      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy["@id"] === policyInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("edcClient.management.policyDefinitionController.get", () => {
    it("succesfully retuns a target policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      const idResponse =
        await edcClient.management.policyDefinitionController.create(
          context,
          policyInput,
        );

      // when
      const policy = await edcClient.management.policyDefinitionController.get(
        context,
        idResponse.id,
      );

      // then
      expect(policy["@id"]).toBe(idResponse.id);
    });

    it("fails to fetch an not existant policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybePolicy = edcClient.management.policyDefinitionController.get(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybePolicy).rejects.toThrowError("resource not found");

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.policyDefinitionController.delete", () => {
    it("deletes a target policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await edcClient.management.policyDefinitionController.create(
        context,
        policyInput,
      );

      // when
      const policy =
        await edcClient.management.policyDefinitionController.delete(
          context,
          policyInput["@id"]!,
        );

      // then
      expect(policy).toBeUndefined();
    });

    it("fails to delete an not existant policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.policyDefinitionController.delete(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

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

  describe("edcClient.management.contractDefinitionController.create", () => {
    it("succesfully creates a new contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      const idResponse =
        await edcClient.management.contractDefinitionController.create(
          context,
          contractDefinitionInput,
        );

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
    });

    it("fails creating two contract definitions with the same id", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      await edcClient.management.contractDefinitionController.create(
        context,
        contractDefinitionInput,
      );
      const maybeCreateResult =
        edcClient.management.contractDefinitionController.create(
          context,
          contractDefinitionInput,
        );

      // then
      await expect(maybeCreateResult).rejects.toThrowError(
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

  describe("edcClient.management.contractDefinitionController.queryAll", () => {
    it("succesfully retuns a list of contract definitions", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": "definition-" + crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      await edcClient.management.contractDefinitionController.create(
        context,
        contractDefinitionInput,
      );

      // when
      const contractDefinitions =
        await edcClient.management.contractDefinitionController.queryAll(
          context,
        );

      // then
      expect(contractDefinitions.length).toBeGreaterThan(0);
      expect(
        contractDefinitions.find(
          (contractDefinition) =>
            contractDefinition["@id"] === contractDefinitionInput["@id"],
        ),
      ).toBeTruthy();
    });
  });

  describe("edcClient.management.contractDefinitionController.get", () => {
    it("succesfully retuns a target contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse =
        await edcClient.management.contractDefinitionController.create(
          context,
          contractDefinitionInput,
        );

      // when
      const contractDefinition =
        await edcClient.management.contractDefinitionController.get(
          context,
          idResponse.id,
        );

      // then
      expect(contractDefinition["@id"]).toBe(idResponse.id);
    });

    it("fails to fetch an not existant contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybePolicy = edcClient.management.contractDefinitionController.get(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybePolicy).rejects.toThrowError("resource not found");

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.contractDefinitionController.delete", () => {
    it("deletes a target contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse =
        await edcClient.management.contractDefinitionController.create(
          context,
          contractDefinitionInput,
        );

      // when
      const contractDefinition =
        await edcClient.management.contractDefinitionController.delete(
          context,
          idResponse.id,
        );

      // then
      expect(contractDefinition).toBeUndefined();
    });

    it("fails to delete an not existant contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeContractDefinition =
        edcClient.management.contractDefinitionController.delete(
          context,
          crypto.randomUUID(),
        );

      // then
      await expect(maybeContractDefinition).rejects.toThrowError(
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
  });

  describe("edcClient.management.updateContractDefinition", () => {
    it("updates a target contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      await edcClient.management.createContractDefinition(
        context,
        contractDefinitionInput,
      );
      const updateContractDefinitionInput = {
        "@id": contractDefinitionInput["@id"],
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      await edcClient.management.updateContractDefinition(
        context,
        updateContractDefinitionInput,
      );

      const updatedContractDefinition =
        await edcClient.management.getContractDefinition(
          context,
          updateContractDefinitionInput["@id"] as string,
        );

      // then
      expect(updatedContractDefinition).toHaveProperty("@type");
      expect(
        updatedContractDefinition[`${EDC_NAMESPACE}:accessPolicyId`],
      ).toEqual(updateContractDefinitionInput.accessPolicyId);
      expect(
        updatedContractDefinition[`${EDC_NAMESPACE}:contractPolicyId`],
      ).toEqual(updateContractDefinitionInput.contractPolicyId);
      expect(
        updatedContractDefinition[`${EDC_NAMESPACE}:assetsSelector`],
      ).toEqual(updateContractDefinitionInput.assetsSelector);
    });

    it("fails to update an inexistant contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const updateContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      const maybeUpdatedContractDefinition =
        edcClient.management.updateContractDefinition(
          context,
          updateContractDefinitionInput,
        );

      // then
      await expect(maybeUpdatedContractDefinition).rejects.toThrowError(
        "resource not found",
      );

      maybeUpdatedContractDefinition.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.requestCatalog", () => {
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
      await edcClient.management.assetController.create(
        providerContext,
        assetInput,
      );

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
      await edcClient.management.policyDefinitionController.create(
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
      await edcClient.management.contractDefinitionController.create(
        providerContext,
        contractDefinitionInput,
      );

      // when
      const catalog = await edcClient.management.requestCatalog(
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

  describe("edcClient.management.initiateContractNegotiation", () => {
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
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);

      // when
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // then
      expect(idResponse).toHaveProperty("id");
      expect(idResponse).toHaveProperty("createdAt");
    });
  });

  describe("edcClient.management.contractNegotiationController.queryAll", () => {
    it("retrieves all contract negotiations", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const contractNegotiations =
        await edcClient.management.contractNegotiationController.queryAll(
          consumerContext,
        );

      // then
      expect(contractNegotiations.length).toBeGreaterThan(0);
      expect(
        contractNegotiations.find(
          (contractNegotiation) => contractNegotiation["@id"] === idResponse.id,
        ),
      ).toBeTruthy();
    });

    it("filters negotiations on the provider side based on agreements' assed ID", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId } = await createContractAgreement(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const [providerNegotiation] =
        await edcClient.management.contractNegotiationController.queryAll(
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

  describe("edcClient.management.contractNegotiationController.get", () => {
    it("retrieves target contract negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const contractNegotiation =
        await edcClient.management.contractNegotiationController.get(
          consumerContext,
          idResponse.id,
        );

      // then
      expect(contractNegotiation).toHaveProperty("@id", idResponse.id);
    });

    it("fails to fetch an not existant contract negotiation", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.contractNegotiationController.get(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.contractNegotiationController.getState", () => {
    it("returns the state of a target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      // when
      const contractNegotiationState =
        await edcClient.management.contractNegotiationController.getState(
          consumerContext,
          idResponse.id,
        );

      // then
      expect(contractNegotiationState).toHaveProperty("state");
    });

    it("fails to fetch an not existant contract negotiation's state", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset =
        edcClient.management.contractNegotiationController.getState(
          context,
          crypto.randomUUID(),
        );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("edcClient.management.contractNegotiationController.cancel", () => {
    it.skip("cancel the requested target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      const negotiationId = idResponse.id;

      // when
      const cancelledNegotiation =
        await edcClient.management.contractNegotiationController.cancel(
          consumerContext,
          negotiationId,
        );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "TERMINATED",
      );

      const negotiationState = await edcClient.management.getNegotiationState(
        consumerContext,
        negotiationId,
      );

      // then
      expect(cancelledNegotiation).toBeUndefined();
      expect(negotiationState.state).toBe("TERMINATED");
    });

    it.skip("fails to cancel an not existant contract negotiation", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset =
        edcClient.management.contractNegotiationController.cancel(
          context,
          crypto.randomUUID(),
        );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

      maybeAsset.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe.skip("edcClient.management.contractNegotiationController.decline", () => {
    it.skip("declines the a requested target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId, idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      const negotiationId = idResponse.id;

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "FINALIZED",
      );

      const providerNegotiation =
        await edcClient.management.contractNegotiationController.queryAll(
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
      await edcClient.management.contractNegotiationController.decline(
        providerContext,
        providerNegotiation[0].contractAgreementId,
      );

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "TERMINATING",
      );

      const negotiationState = await edcClient.management.getNegotiationState(
        consumerContext,
        negotiationId,
      );

      // then
      expect(negotiationState.state).toBe("TERMINATING");
    });
  });

  describe("edcClient.management.contractNegotiationController.getAgreement", () => {
    it("returns the a agreement for a target negotiation", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { assetId, idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );

      const negotiationId = idResponse.id;

      await waitForNegotiationState(
        edcClient,
        consumerContext,
        negotiationId,
        "FINALIZED",
      );

      // when
      const contractAgreement =
        await edcClient.management.contractNegotiationController.getAgreement(
          consumerContext,
          negotiationId,
        );

      // then
      expect(contractAgreement).toHaveProperty("assetId", assetId);
    });
  });

  describe("edcClient.management.contractAgreementController.queryAll", () => {
    it("retrieves all contract agreements", async () => {
      // given
      const consumerContext = edcClient.createContext(apiToken, consumer);
      const providerContext = edcClient.createContext(apiToken, provider);
      const { idResponse } = await createContractNegotiation(
        edcClient,
        providerContext,
        consumerContext,
      );
      await waitForNegotiationState(
        edcClient,
        consumerContext,
        idResponse.id,
        "FINALIZED",
      );
      const contractNegotiation =
        await edcClient.management.contractNegotiationController.get(
          consumerContext,
          idResponse.id,
        );

      // when
      const contractAgreements =
        await edcClient.management.contractAgreementController.queryAll(
          consumerContext,
        );

      // then
      expect(contractAgreements.length).toBeGreaterThan(0);
      expect(
        contractAgreements.find(
          (agreement) =>
            agreement.id === contractNegotiation.contractAgreementId,
        ),
      ).toBeTruthy();
    });
  });

  describe("edcClient.management.getAgreement", () => {
    it("retrieves target contract agreement", async () => {
      // given
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

    it("fails to fetch an not existent contract negotiation", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);

      // when
      const maybeAsset = edcClient.management.contractAgreementController.get(
        context,
        crypto.randomUUID(),
      );

      // then
      await expect(maybeAsset).rejects.toThrowError("resource not found");

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

    describe("edcClient.management.transferProcessController.queryAll", () => {
      it("retrieves all tranfer processes", async () => {
        // given
        const consumerContext = edcClient.createContext(apiToken, consumer);
        const providerContext = edcClient.createContext(apiToken, provider);
        const dataplaneInput = {
          id: "provider-dataplane",
          url: "http://provider-connector:9192/control/transfer",
          allowedSourceTypes: ["HttpData"],
          allowedDestTypes: ["HttpProxy", "HttpData"],
          properties: {
            publicApiUrl: "http://provider-connector:9291/public/",
          },
        };

        await edcClient.management.dataplaneController.register(
          providerContext,
          dataplaneInput,
        );

        const { assetId, contractAgreement } = await createContractAgreement(
          edcClient,
          providerContext,
          consumerContext,
        );

        const idResponse =
          await edcClient.management.transferProcessController.initiate(
            consumerContext,
            {
              assetId,
              connectorId: "provider",
              connectorAddress: providerContext.protocol,
              contractId: contractAgreement.id,
              managedResources: false,
              dataDestination: { type: "HttpProxy" },
            },
          );

        // when
        const transferProcesses =
          await edcClient.management.transferProcessController.queryAll(
            consumerContext,
          );

        // then
        expect(transferProcesses.length).toBeGreaterThan(0);
        expect(
          transferProcesses.find(
            (transferProcess) => idResponse.id === transferProcess.id,
          ),
        ).toBeTruthy();
      });
    });
  });

  describe("edcClient.management.dataplaneController.register", () => {
    it("succesfully register a dataplane", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const dataplaneInput = {
        id: "consumer-dataplane",
        url: "http://consumer-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://consumer-connector:9291/public/",
        },
      };

      // when
      const registration =
        await edcClient.management.dataplaneController.register(
          context,
          dataplaneInput,
        );

      // then
      expect(registration).toBeUndefined();
    });
  });

  describe("edcClient.management.listDataplanes", () => {
    it("succesfully list available dataplanes", async () => {
      const context = edcClient.createContext(apiToken, consumer);
      const input = {
        url: "http://consumer-connector:9192/control/transfer",
        allowedSourceTypes: ["HttpData"],
        allowedDestTypes: ["HttpProxy", "HttpData"],
        properties: {
          publicApiUrl: "http://consumer-connector:9291/public/",
        },
      };
      await edcClient.management.dataplaneController.register(context, input);

      const dataplanes = await edcClient.management.dataplaneController.list(
        context,
      );

      expect(dataplanes.length).toBeGreaterThan(0);
      dataplanes.forEach((dataplane) => {
        expect(dataplane).toHaveProperty("id");
        expect(dataplane).toHaveProperty("url", input.url);
        expect(dataplane).toHaveProperty(
          "allowedDestTypes",
          input.allowedDestTypes,
        );
        expect(dataplane).toHaveProperty(
          "allowedSourceTypes",
          input.allowedSourceTypes,
        );
        expect(dataplane.properties).toHaveProperty(
          `${EDC_NAMESPACE}:publicApiUrl`,
          "http://consumer-connector:9291/public/",
        );
      });
    });
  });
});
