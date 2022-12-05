import { Addresses, EdcClient } from "../../src";
import { EdcClientError, EdcClientErrorType } from "../../src/error";

describe("PublicController", () => {
  const apiToken = "123456";
  const addresses: Addresses = {
    default: "http://localhost:19191",
    validation: "http://localhost:19192",
    data: "http://localhost:19193",
    ids: "http://localhost:19194",
    dataplane: "http://localhost:19195",
    public: "http://localhost:19291",
    control: "http://localhost:19292",
  };

  describe("edcClient.public.getTranferedData", () => {
    it("fails to return an object in response", async () => {
      // given
      const edcClient = new EdcClient();
      const context = edcClient.createContext(apiToken, addresses);

      // when
      const maybeData = await edcClient.public.getTranferedData(context, {});

      // then
      await expect(maybeData).rejects.toThrowError(
        "you're not authorized to access this resource",
      );

      maybeData.catch((error) => {
        expect(error).toBeInstanceOf(EdcClientError);
        expect(error as EdcClientError).toHaveProperty(
          "type",
          EdcClientErrorType.NotFound,
        );
      });
    });
  });
});
