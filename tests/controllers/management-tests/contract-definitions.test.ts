import * as crypto from "node:crypto";
import {
  Addresses,
  ContractDefinitionInput,
  EdcConnectorClient,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("ManagementController", () => {
  const apiToken = "123456";
  const consumer: Addresses = {
    default: "http://localhost:19191/api",
    management: "http://localhost:19193/management",
    protocol: "http://consumer-connector:9194/protocol",
    public: "http://localhost:19291/public",
    control: "http://localhost:19292/control",
  };

  const edcClient = new EdcConnectorClient();

  describe("edcClient.management.contractDefinitions.create", () => {
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
      const idResponse = await edcClient.management.contractDefinitions.create(
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
      await edcClient.management.contractDefinitions.create(
        context,
        contractDefinitionInput,
      );
      const maybeCreateResult = edcClient.management.contractDefinitions.create(
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

  describe("edcClient.management.contractDefinitions.queryAll", () => {
    it("succesfully retuns a list of contract definitions", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": "definition-" + crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      await edcClient.management.contractDefinitions.create(
        context,
        contractDefinitionInput,
      );

      // when
      const contractDefinitions =
        await edcClient.management.contractDefinitions.queryAll(context);

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

  describe("edcClient.management.contractDefinitions.get", () => {
    it("succesfully retuns a target contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await edcClient.management.contractDefinitions.create(
        context,
        contractDefinitionInput,
      );

      // when
      const contractDefinition =
        await edcClient.management.contractDefinitions.get(
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
      const maybePolicy = edcClient.management.contractDefinitions.get(
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

  describe("edcClient.management.contractDefinitions.delete", () => {
    it("deletes a target contract definition", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await edcClient.management.contractDefinitions.create(
        context,
        contractDefinitionInput,
      );

      // when
      const contractDefinition =
        await edcClient.management.contractDefinitions.delete(
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
        edcClient.management.contractDefinitions.delete(
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
});
