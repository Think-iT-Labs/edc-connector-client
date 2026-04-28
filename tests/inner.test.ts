import nock = require('nock');
import { EdcConnectorClientError, EdcConnectorClientErrorType } from "../src";
import { Inner } from "../src/inner";

describe("Inner", () => {
  const url = "http://www.example.com";
  const inner = new Inner();

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  it("should map error 404", async () => {
    nock(url).post('/path').reply(404);

    const response = inner.request(url, {
      path: "/path",
      method: "POST"
    })

    await expect(response).rejects.toThrow("resource not found");

    response.catch((error) => {
      expect(error).toBeInstanceOf(EdcConnectorClientError);
      expect(error as EdcConnectorClientError).toHaveProperty(
        "type",
        EdcConnectorClientErrorType.NotFound,
      );
    });
  })

  it("should map error 409", async () => {
    nock(url).post('/path').reply(409);

    const response = inner.request(url, {
      path: "/path",
      method: "POST"
    })

    await expect(response).rejects.toThrow("duplicated resource");

    response.catch((error) => {
      expect(error).toBeInstanceOf(EdcConnectorClientError);
      expect(error as EdcConnectorClientError).toHaveProperty(
        "type",
        EdcConnectorClientErrorType.Duplicate,
      );
    });
  })
})
