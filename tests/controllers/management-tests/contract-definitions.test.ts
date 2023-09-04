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
      // given
      const id = crypto.randomUUID();
      const input: ContractDefinitionInput = {
        "@id": id,
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      const idResponse = await contractDefinitions.create(input);

      // then
      expect(idResponse.id).toBe(id);
      expect(idResponse.createdAt).toBeGreaterThan(0);
    });

    it("fails creating two contract definitions with the same id", async () => {
      // given
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      await contractDefinitions.create(contractDefinitionInput);
      const maybeCreateResult = contractDefinitions.create(
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

  describe("queryAll", () => {
    it("succesfully retuns a list of contract definitions", async () => {
      // given
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": "definition-" + crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      await contractDefinitions.create(
        contractDefinitionInput,
      );

      // when
      const result = await contractDefinitions.queryAll();

      // then
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.find(
          (contractDefinition) =>
            contractDefinition["@id"] === contractDefinitionInput["@id"],
        ),
      ).toBeTruthy();
    });
  });

  describe("get", () => {
    it("succesfully retuns a target contract definition", async () => {
      // given
      const input: ContractDefinitionInput = {
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await contractDefinitions.create(input);

      // when
      const contractDefinition = await contractDefinitions.get(idResponse.id);

      // then
      expect(contractDefinition.id).toBe(idResponse.id);
    });

    it("fails to fetch an not existant contract definition", async () => {
      // when
      const maybePolicy = contractDefinitions.get(crypto.randomUUID());

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

  describe("delete", () => {
    it("deletes a target contract definition", async () => {
      // given
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await contractDefinitions.create(
        contractDefinitionInput,
      );

      // when
      const contractDefinition = await contractDefinitions.delete(idResponse.id);

      // then
      expect(contractDefinition).toBeUndefined();
    });

    it("fails to delete an not existant contract definition", async () => {
      // when
      const maybeContractDefinition =
        contractDefinitions.delete(crypto.randomUUID());

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

    describe("edcClient.management.updateContractDefinition", () => {
      it("updates a target contract definition", async () => {
        // given
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

        // when
        await contractDefinitions.update(
          updateContractDefinitionInput,
        );

        const updatedContractDefinition =
          await contractDefinitions.get(
            updateContractDefinitionInput["@id"] as string,
          );

        // then
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
        // given
        const updateContractDefinitionInput = {
          "@id": crypto.randomUUID(),
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        // when
        const maybeUpdatedContractDefinition =
          contractDefinitions.update(
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
  });
});
