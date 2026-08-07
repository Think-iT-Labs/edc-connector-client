import { EdcConnectorClientError, EdcConnectorClientErrorType } from "./error";

interface InnerRequest {
  path: string;
  method: "DELETE" | "GET" | "POST" | "PUT" | "PATCH";
  query?: Record<string, string>;
  body?: unknown;
  authorization?: Record<string, string> | undefined;
  headers?: Record<string, string>;
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
        ...(innerRequest.authorization ?? {}),
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
          throw new EdcConnectorClientError(
            EdcConnectorClientErrorType.BadRequest,
            "request was malformed: " + errorMessage,
          );
        }
        case 404: {
          throw new EdcConnectorClientError(
            EdcConnectorClientErrorType.NotFound,
            "resource not found: " + errorMessage,
          );
        }
        case 409: {
          throw new EdcConnectorClientError(
            EdcConnectorClientErrorType.Duplicate,
            "duplicated resource: " + errorMessage,
          );
        }

        case 502: {
          throw new EdcConnectorClientError(
            EdcConnectorClientErrorType.BadGateway,
            "Bad Gateway: " + errorMessage,
          );
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
