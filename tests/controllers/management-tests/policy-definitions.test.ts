import * as crypto from "node:crypto";
import {
  Addresses,
  EdcConnectorClient,
  PolicyDefinitionInput,
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

  describe("edcClient.management.policyDefinitions.create", () => {
    it("succesfully creates a new policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };

      // when
      const idResponse = await edcClient.management.policyDefinitions.create(
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
      await edcClient.management.policyDefinitions.create(context, policyInput);
      const maybeCreateResult = edcClient.management.policyDefinitions.create(
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

  describe("edcClient.management.policyDefinitions.queryAll", () => {
    it("succesfully retuns a list of assets", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await edcClient.management.policyDefinitions.create(context, policyInput);

      // when
      const policies = await edcClient.management.policyDefinitions.queryAll(
        context,
      );

      // then
      expect(policies.length).toBeGreaterThan(0);
      expect(
        policies.find((policy) => policy["@id"] === policyInput["@id"]),
      ).toBeTruthy();
    });
  });

  describe("edcClient.management.policyDefinitions.get", () => {
    it("succesfully retuns a target policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      const idResponse = await edcClient.management.policyDefinitions.create(
        context,
        policyInput,
      );

      // when
      const policy = await edcClient.management.policyDefinitions.get(
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
      const maybePolicy = edcClient.management.policyDefinitions.get(
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

  describe("edcClient.management.policyDefinitions.delete", () => {
    it("deletes a target policy", async () => {
      // given
      const context = edcClient.createContext(apiToken, consumer);
      const policyInput: PolicyDefinitionInput = {
        "@id": crypto.randomUUID(),
        policy: {},
      };
      await edcClient.management.policyDefinitions.create(context, policyInput);

      // when
      const policy = await edcClient.management.policyDefinitions.delete(
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
      const maybeAsset = edcClient.management.policyDefinitions.delete(
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
});
