import * as crypto from "node:crypto";
import {
  ContractDefinitionInput,
  EdcConnectorClient,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("ContractDefinitionController", () => {
  const edcClient = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  const contractDefinitions = edcClient.management.contractDefinitions;

  describe("create", () => {
    it("succesfully creates a new contract definition", async () => {
      const id = crypto.randomUUID();
      const input: ContractDefinitionInput = {
        "@id": id,
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      const idResponse = await contractDefinitions.create(input);

      expect(idResponse.id).toBe(id);
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("fails creating two contract definitions with the same id", async () => {
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      await contractDefinitions.create(contractDefinitionInput);
      const maybeCreateResult = contractDefinitions.create(
        contractDefinitionInput,
      );

      await expect(maybeCreateResult).rejects.toThrow(
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

  describe("queryAll", () => {
    it("succesfully retuns a list of contract definitions", async () => {
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": "definition-" + crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      await contractDefinitions.create(
        contractDefinitionInput,
      );

      const result = await contractDefinitions.queryAll();

      expect(result.length).toBeGreaterThan(0);
      expect(
        result.find(
          (contractDefinition) =>
            contractDefinition.id === contractDefinitionInput["@id"],
        ),
      ).toBeTruthy();
    });
  });

  describe("get", () => {
    it("succesfully retuns a target contract definition", async () => {
      const accessPolicyId = crypto.randomUUID();
      const contractPolicyId = crypto.randomUUID();
      const input: ContractDefinitionInput = {
        accessPolicyId,
        contractPolicyId,
        assetsSelector: [{
          operandLeft: "foo",
          operator: "=",
          operandRight: "bar"
        }],
      };
      const idResponse = await contractDefinitions.create(input);

      const contractDefinition = await contractDefinitions.get(idResponse.id);

      expect(contractDefinition.id).toBe(idResponse.id);
      expect(contractDefinition.accessPolicyId).toBe(accessPolicyId);
      expect(contractDefinition.contractPolicyId).toBe(contractPolicyId);
      expect(contractDefinition.assetsSelector.length).toBe(1);
      expect(contractDefinition.assetsSelector[0].operandLeft).toBe("foo");
      expect(contractDefinition.assetsSelector[0].operator).toBe("=");
      expect(contractDefinition.assetsSelector[0].operandRight).toBe("bar");
    });

    it("fails to fetch an not existant contract definition", async () => {
      const maybePolicy = contractDefinitions.get(crypto.randomUUID());

      await expect(maybePolicy).rejects.toThrow("resource not found");

      maybePolicy.catch((error) => {
        expect(error).toBeInstanceOf(EdcConnectorClientError);
        expect(error as EdcConnectorClientError).toHaveProperty(
          "type",
          EdcConnectorClientErrorType.NotFound,
        );
      });
    });
  });

  describe("delete", () => {
    it("deletes a target contract definition", async () => {
      const input: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await contractDefinitions.create(input);

      const contractDefinition = await contractDefinitions.delete(idResponse.id);

      expect(contractDefinition).toBeUndefined();
    });

    it("fails to delete an not existant contract definition", async () => {
      const maybeContractDefinition =
        contractDefinitions.delete(crypto.randomUUID());

      await expect(maybeContractDefinition).rejects.toThrow(
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

    describe("update", () => {
      it("updates a target contract definition", async () => {
        const contractDefinitionInput: ContractDefinitionInput = {
          "@id": crypto.randomUUID(),
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        await contractDefinitions.create(
          contractDefinitionInput,
        );
        const updateContractDefinitionInput = {
          "@id": contractDefinitionInput["@id"],
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        await contractDefinitions.update(
          updateContractDefinitionInput,
        );

        const updatedContractDefinition =
          await contractDefinitions.get(updateContractDefinitionInput["@id"]!);

        expect(updatedContractDefinition).toHaveProperty("@type");
        expect(
          updatedContractDefinition.accessPolicyId,
        ).toEqual(updateContractDefinitionInput.accessPolicyId);
        expect(
          updatedContractDefinition.contractPolicyId,
        ).toEqual(updateContractDefinitionInput.contractPolicyId);
        expect(
          updatedContractDefinition.assetsSelector,
        ).toEqual(updateContractDefinitionInput.assetsSelector);
      });

      it("fails to update an inexistant contract definition", async () => {
        const updateContractDefinitionInput = {
          "@id": crypto.randomUUID(),
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        const maybeUpdatedContractDefinition =
          contractDefinitions.update(
            updateContractDefinitionInput,
          );

        await expect(maybeUpdatedContractDefinition).rejects.toThrow(
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
  });
});
