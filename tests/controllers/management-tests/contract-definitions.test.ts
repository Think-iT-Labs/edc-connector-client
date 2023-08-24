import * as crypto from "node:crypto";
import {
  ContractDefinitionInput,
  EDC_NAMESPACE,
  EdcConnectorClientBuilder,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("ContractDefinitionController", () => {
  const edcClient = new EdcConnectorClientBuilder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  describe("create", () => {
    it("succesfully creates a new contract definition", async () => {
      // given
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };

      // when
      const idResponse = await edcClient.management.contractDefinitions.create(
        contractDefinitionInput,
      );

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
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
      await edcClient.management.contractDefinitions.create(
        contractDefinitionInput,
      );
      const maybeCreateResult = edcClient.management.contractDefinitions.create(
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
      await edcClient.management.contractDefinitions.create(
        contractDefinitionInput,
      );

      // when
      const contractDefinitions =
        await edcClient.management.contractDefinitions.queryAll();

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

  describe("get", () => {
    it("succesfully retuns a target contract definition", async () => {
      // given
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await edcClient.management.contractDefinitions.create(
        contractDefinitionInput,
      );

      // when
      const contractDefinition =
        await edcClient.management.contractDefinitions.get(
          idResponse.id,
        );

      // then
      expect(contractDefinition["@id"]).toBe(idResponse.id);
    });

    it("fails to fetch an not existant contract definition", async () => {
      // when
      const maybePolicy = edcClient.management.contractDefinitions.get(
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

  describe("delete", () => {
    it("deletes a target contract definition", async () => {
      // given
      const contractDefinitionInput: ContractDefinitionInput = {
        "@id": crypto.randomUUID(),
        accessPolicyId: crypto.randomUUID(),
        contractPolicyId: crypto.randomUUID(),
        assetsSelector: [],
      };
      const idResponse = await edcClient.management.contractDefinitions.create(
        contractDefinitionInput,
      );

      // when
      const contractDefinition =
        await edcClient.management.contractDefinitions.delete(
          idResponse.id,
        );

      // then
      expect(contractDefinition).toBeUndefined();
    });

    it("fails to delete an not existant contract definition", async () => {
      // when
      const maybeContractDefinition =
        edcClient.management.contractDefinitions.delete(
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

    describe("edcClient.management.updateContractDefinition", () => {
      it("updates a target contract definition", async () => {
        // given
        const contractDefinitionInput: ContractDefinitionInput = {
          "@id": crypto.randomUUID(),
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        await edcClient.management.contractDefinitions.create(
          contractDefinitionInput,
        );
        const updateContractDefinitionInput = {
          "@id": contractDefinitionInput["@id"],
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        // when
        await edcClient.management.contractDefinitions.update(
          updateContractDefinitionInput,
        );

        const updatedContractDefinition =
          await edcClient.management.contractDefinitions.get(
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
        const updateContractDefinitionInput = {
          "@id": crypto.randomUUID(),
          accessPolicyId: crypto.randomUUID(),
          contractPolicyId: crypto.randomUUID(),
          assetsSelector: [],
        };

        // when
        const maybeUpdatedContractDefinition =
          edcClient.management.contractDefinitions.update(
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
