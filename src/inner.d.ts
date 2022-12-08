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
export declare class Inner {
    #private;
    request<T>(baseUrl: string, innerRequest: InnerRequest): Promise<T>;
    stream(baseUrl: string, innerRequest: InnerStream): Promise<Response>;
}
export {};
