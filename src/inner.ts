import { EdcConnectorClientError, EdcConnectorClientErrorType } from "./error";

interface InnerRequest {
  path: string;
  method: "DELETE" | "GET" | "POST" | "PUT" | "PATCH";
  query?: Record<string, string>;
  body?: unknown;
  apiToken?: string;
  headers?: Record<string, string | undefined>;
}

interface InnerStream extends InnerRequest {
  body?: undefined;
  apiToken?: undefined;
}

export class Inner {
  async request<T>(baseUrl: string, innerRequest: InnerRequest): Promise<T> {
    innerRequest.headers = innerRequest.headers || {};
    innerRequest.headers["Content-type"] = "application/json";

    const response = await this.#fetch(baseUrl, innerRequest);

    if (response.status === 204) {
      return undefined as any as T;
    }

    return response.json();
  }

  async stream(baseUrl: string, innerRequest: InnerStream): Promise<Response> {
    const response = await this.#fetch(baseUrl, innerRequest);

    if (response.status === 204 || !response.body) {
      throw new EdcConnectorClientError(
        EdcConnectorClientErrorType.Unreachable,
        "response is never empty",
      );
    }

    return response;
  }

  async #fetch(baseUrl: string, innerRequest: InnerRequest): Promise<Response> {
    const searchParams = new URLSearchParams();
    if (innerRequest.query) {
      Object.entries(innerRequest.query).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
    }

    const url = `${baseUrl}${innerRequest.path}?${searchParams.toString()}`;

    const method = innerRequest.method;
    const request = new Request(url, {
      method,
      headers: {
        ...innerRequest.headers,
        "X-Api-Key": innerRequest.apiToken ?? "",
      },
      body: innerRequest.body ? JSON.stringify(innerRequest.body) : undefined,
    });

    try {
      const response = await fetch(request);

      if (response.ok) {
        return response;
      }

      const errorMessage = await response.text();

      switch (response.status) {
        case 400: {
          const error = new EdcConnectorClientError(
            EdcConnectorClientErrorType.BadRequest,
            "request was malformed: " + errorMessage,
          );

          throw error;
        }
        case 404: {
          const error = new EdcConnectorClientError(
            EdcConnectorClientErrorType.NotFound,
            "resource not found: " + errorMessage,
          );

          throw error;
        }
        case 409: {
          const error = new EdcConnectorClientError(
            EdcConnectorClientErrorType.Duplicate,
            "duplicated resource: " + errorMessage,
          );

          throw error;
        }
        default: {
          throw new EdcConnectorClientError(
            EdcConnectorClientErrorType.Unknown,
            errorMessage,
          );
        }
      }
    } catch (error) {
      if (!(error instanceof EdcConnectorClientError)) {
        const typedError = error as any;
        error = new EdcConnectorClientError(
          EdcConnectorClientErrorType.Unknown,
          `something went wrong: ${typedError.message}. ${typedError.body}`,
          { cause: typedError },
        );
      }

      throw error;
    }
  }
}
