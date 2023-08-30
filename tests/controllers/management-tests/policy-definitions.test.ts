import * as crypto from "node:crypto";
import {
  EdcConnectorClient,
  PolicyDefinitionInput,
} from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("PolicyDefinitionController", () => {
  const edcClient = new EdcConnectorClient.Builder()
    .apiToken("123456")
    .managementUrl("http://localhost:19193/management")
    .build();

  const policyDefinitions = edcClient.management.policyDefinitions;

  describe("create", () => {
    it("succesfully creates a new policy", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };

      // when
      const idResponse = await policyDefinitions.create(policyInput);

      // then
      expect(idResponse).toHaveProperty("createdAt");
      expect(idResponse).toHaveProperty("id");
    });

    it("fails creating two policies with the same id", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };

      // when
      await policyDefinitions.create(policyInput);
      const maybeCreateResult = edcClient.management.policyDefinitions.create(
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

  describe("queryAll", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await policyDefinitions.create(policyInput);

      // when
      const policies = await policyDefinitions.queryAll();

      // then
      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy["@id"] === policyInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("get", () => {
    it("succesfully retuns a target policy", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      const idResponse = await policyDefinitions.create(
        policyInput,
      );

      // when
      const policy = await policyDefinitions.get(
        idResponse.id,
      );

      // then
      expect(policy["@id"]).toBe(idResponse.id);
    });

    it("fails to fetch an not existant policy", async () => {
      // given

      // when
      const maybePolicy = edcClient.management.policyDefinitions.get(
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
    it("deletes a target policy", async () => {
      // given
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await policyDefinitions.create(policyInput);

      // when
      const policy = await policyDefinitions.delete(
        policyInput["@id"]!,
      );

      // then
      expect(policy).toBeUndefined();
    });

    it("fails to delete an not existant policy", async () => {
      // given

      // when
      const maybeAsset = edcClient.management.policyDefinitions.delete(
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
});
