import * as crypto from "node:crypto";
import {
  ContractDefinitionInput,
  DEFAULT_MANAGEMENT_API_VERSION,
  EdcConnectorClient,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("ContractDefinitionController", () => {
  const v3Client = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion(DEFAULT_MANAGEMENT_API_VERSION)
    .build();

  const v4Client = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .managementApiVersion("v4")
    .build();

  const v3ContractDefinitions = v3Client.management.contractDefinitions;
  const v4ContractDefinitions = v4Client.management.contractDefinitions;

  const buildContractDefinitionInput = (
    id: string,
    version: string,
  ): ContractDefinitionInput => ({
    "@id": id,
    ...(version === "v4" ? { "@type": "ContractDefinition" as const } : {}),
    accessPolicyId: crypto.randomUUID(),
    contractPolicyId: crypto.randomUUID(),
    assetsSelector: [],
  });

  const runContractDefinitionTests = (
    label: string,
    contractDefinitions: any,
    version: string,
  ): void => {
    describe(label, () => {
      describe("create", () => {
        it("succesfully creates a new contract definition", async () => {
          const id = crypto.randomUUID();
          const input = buildContractDefinitionInput(id, version);

          const idResponse = await contractDefinitions.create(input);

          expect(idResponse.id).toBe(id);
          expect(idResponse.createdAt).toBeGreaterThan(0);
        });

        it("fails creating two contract definitions with the same id", async () => {
          const input = buildContractDefinitionInput(
            crypto.randomUUID(),
            version,
          );

          await contractDefinitions.create(input);
          const maybeCreateResult = contractDefinitions.create(input);

          await expect(maybeCreateResult).rejects.toThrow(
            "duplicated resource",
          );

          maybeCreateResult.catch((error: unknown) => {
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
          const input = buildContractDefinitionInput(
            "definition-" + crypto.randomUUID(),
            version,
          );
          await contractDefinitions.create(input);

          const result = await contractDefinitions.queryAll();

          expect(result.length).toBeGreaterThan(0);
          expect(
            result.find(
              (contractDefinition: any) =>
                contractDefinition.id === input["@id"],
            ),
          ).toBeTruthy();
        });
      });

      describe("get", () => {
        it("succesfully retuns a target contract definition", async () => {
          const accessPolicyId = crypto.randomUUID();
          const contractPolicyId = crypto.randomUUID();
          const input: ContractDefinitionInput = {
            "@type": "ContractDefinition",
            accessPolicyId,
            contractPolicyId,
            assetsSelector: [
              {
                "@type": "Criterion",
                operandLeft: "foo",
                operator: "=",
                operandRight: "bar",
              },
            ],
          };
          const idResponse = await contractDefinitions.create(input);

          const contractDefinition = await contractDefinitions.get(
            idResponse.id,
          );

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

          maybePolicy.catch((error: unknown) => {
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
          const input = buildContractDefinitionInput(
            crypto.randomUUID(),
            version,
          );
          const idResponse = await contractDefinitions.create(input);

          const result = await contractDefinitions.delete(idResponse.id);

          expect(result).toBeUndefined();
        });

        it("fails to delete an not existant contract definition", async () => {
          const maybeContractDefinition = contractDefinitions.delete(
            crypto.randomUUID(),
          );

          await expect(maybeContractDefinition).rejects.toThrow(
            "resource not found",
          );

          maybeContractDefinition.catch((error: unknown) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });

      describe("update", () => {
        it("updates a target contract definition", async () => {
          const input = buildContractDefinitionInput(
            crypto.randomUUID(),
            version,
          );

          await contractDefinitions.create(input);
          const updateInput: ContractDefinitionInput = {
            ...(version === "v4"
              ? { "@type": "ContractDefinition" as const }
              : {}),
            "@id": input["@id"],
            accessPolicyId: crypto.randomUUID(),
            contractPolicyId: crypto.randomUUID(),
            assetsSelector: [],
          };

          await contractDefinitions.update(updateInput);

          const updated = await contractDefinitions.get(updateInput["@id"]!);

          expect(updated).toHaveProperty("@type");
          expect(updated.accessPolicyId).toEqual(updateInput.accessPolicyId);
          expect(updated.contractPolicyId).toEqual(updateInput.contractPolicyId);
          expect(updated.assetsSelector).toEqual(updateInput.assetsSelector);
        });

        it("fails to update an inexistant contract definition", async () => {
          const updateInput: ContractDefinitionInput = {
            ...(version === "v4"
              ? { "@type": "ContractDefinition" as const }
              : {}),
            "@id": crypto.randomUUID(),
            accessPolicyId: crypto.randomUUID(),
            contractPolicyId: crypto.randomUUID(),
            assetsSelector: [],
          };

          const maybeUpdated = contractDefinitions.update(updateInput);

          await expect(maybeUpdated).rejects.toThrow("resource not found");

          maybeUpdated.catch((error: unknown) => {
            expect(error).toBeInstanceOf(EdcConnectorClientError);
            expect(error as EdcConnectorClientError).toHaveProperty(
              "type",
              EdcConnectorClientErrorType.NotFound,
            );
          });
        });
      });
    });
  };

  runContractDefinitionTests("v3", v3ContractDefinitions, "v3");
  runContractDefinitionTests("v4", v4ContractDefinitions, "v4");
});
