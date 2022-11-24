import { TypedError } from "@think-it-labs/typed-error";
import { ApiErrorDetail } from "./entities";

export enum EdcClientErrorType {
  Unknown = "Unknown",
  Duplicate = "Duplicate",
  NotFound = "NotFound",
}

export class EdcClientError extends TypedError<EdcClientErrorType> {
  body?: ApiErrorDetail[];
}
