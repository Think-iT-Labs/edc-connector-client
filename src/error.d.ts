import { TypedError } from "@think-it-labs/typed-error";
import { ApiErrorDetail } from "./entities";
export declare enum EdcClientErrorType {
    Unknown = "Unknown",
    Duplicate = "Duplicate",
    NotFound = "NotFound"
}
export declare class EdcClientError extends TypedError<EdcClientErrorType> {
    body?: ApiErrorDetail[];
}
