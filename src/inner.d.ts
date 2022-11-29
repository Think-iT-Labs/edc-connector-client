interface InnerRequest {
    path: string;
    method: "DELETE" | "GET" | "POST" | "PUT";
    query?: Record<string, string>;
    body?: unknown;
    apiToken?: string;
}
export declare class Inner {
    request<T>(baseUrl: string, innerRequest: InnerRequest): Promise<T>;
}
export {};
