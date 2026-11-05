import * as crypto from "node:crypto";
import { EdcConnectorClient } from "../../../src";
import {
  EdcConnectorClientError,
  EdcConnectorClientErrorType,
} from "../../../src/error";

describe("DataplaneController", () => {

  const v4Provider = new EdcConnectorClient.Builder()
    .authorization("X-Api-Key", "123456")
    .managementUrl("http://localhost:29193/management")
    .managementApiVersion("v4")
    .build();

  const runDataplaneTests = (
    label: string,
    provider: EdcConnectorClient,
  ): void => {
    describe(label, () => {
      const dataplanes = provider.management.dataplanes;

      describe("list", () => {
        it("succesfully list available dataplanes", async () => {
          const result = await dataplanes.list();

          expect(result.length).toBeGreaterThan(0);
          result.forEach((dataplane) => {
            expect(dataplane).toHaveProperty("id");
            expect(dataplane).toHaveProperty("url");
            expect(dataplane).toHaveProperty("allowedSourceTypes");
            expect(dataplane).toHaveProperty("allowedTransferTypes");
          });
        });
      });

      describe("register", () => {
        it("registers a data plane instance", async () => {
          const dataplaneId = crypto.randomUUID();

          await expect(
            dataplanes.register({
              dataplaneId,
              endpoint: "http://localhost:9192/control/v1/dataflows",
              transferTypes: ["HttpData-PULL"],
              labels: ["test"],
            }),
          ).resolves.not.toThrow();

          const registered = await dataplanes.list();
          expect(registered.map((it) => it.id)).toContain(dataplaneId);
        });

        it("is idempotent for the same data plane id", async () => {
          const dataplaneId = crypto.randomUUID();
          const input = {
            dataplaneId,
            endpoint: "http://localhost:9192/control/v1/dataflows",
            transferTypes: ["HttpData-PULL"],
          };

          await dataplanes.register(input);

          await expect(dataplanes.register(input)).resolves.not.toThrow();
        });
      });

      describe("delete", () => {
        it("deletes a registered data plane instance", async () => {
          const dataplaneId = crypto.randomUUID();
          await dataplanes.register({
            dataplaneId,
            endpoint: "http://localhost:9192/control/v1/dataflows",
            transferTypes: ["HttpData-PULL"],
          });

          await expect(dataplanes.delete(dataplaneId)).resolves.not.toThrow();

          const remaining = await dataplanes.list();
          expect(remaining.map((it) => it.id)).not.toContain(dataplaneId);
        });

        it("fails to delete a non-existent data plane instance", async () => {
          const maybeDeleted = dataplanes.delete(crypto.randomUUID());

          await expect(maybeDeleted).rejects.toThrow("resource not found");

          maybeDeleted.catch((error) => {
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

  runDataplaneTests("v4", v4Provider);

});
