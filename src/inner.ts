import { EdcClientError, EdcClientErrorType } from "./error";

interface InnerRequest {
  path: string;
  method: "DELETE" | "GET" | "POST" | "PUT";
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

  async stream(
    baseUrl: string,
    innerRequest: InnerStream,
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await this.#fetch(baseUrl, innerRequest);

    if (response.status === 204 || !response.body) {
      throw new EdcClientError(
        EdcClientErrorType.Unreachable,
        "response is never empty",
      );
    }

    return response.body;
  }

  async #fetch(baseUrl: string, innerRequest: InnerRequest): Promise<Response> {
    const url = new URL(innerRequest.path, baseUrl);

    if (innerRequest.query) {
      Object.entries(innerRequest.query).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

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

      switch (response.status) {
        case 404: {
          const error = new EdcClientError(
            EdcClientErrorType.NotFound,
            "resource not found",
          );

          error.body = await response.json();

          throw error;
        }
        case 409: {
          const error = new EdcClientError(
            EdcClientErrorType.Duplicate,
            "duplicated resource",
          );

          error.body = await response.json();

          throw error;
        }
        case 403: {
          const error = new EdcClientError(
            EdcClientErrorType.Unauthorized,
            "you're not authorized to access this resource",
          );

          error.body = await response.json();

          throw error;
        }

        default: {
          throw new EdcClientError(
            EdcClientErrorType.Unknown,
            await response.text(),
          );
        }
      }
    } catch (error) {
      if (!(error instanceof EdcClientError)) {
        error = new EdcClientError(
          EdcClientErrorType.Unknown,
          "something went wrong",
          { cause: error as Error },
        );
      }

      throw error;
    }
  }
}
