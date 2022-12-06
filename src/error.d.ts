import { TypedError } from "@think-it-labs/typed-error";
import { ApiErrorDetail } from "./entities";
export declare enum EdcConnectorClientErrorType {
    Unknown = "Unknown",
    Duplicate = "Duplicate",
    NotFound = "NotFound"
}
export declare class EdcConnectorClientError extends TypedError<EdcConnectorClientErrorType> {
    body?: ApiErrorDetail[];
}
