import { TypedError } from "@think-it-labs/typed-error";
import { ApiErrorDetail } from "./entities";

export enum EdcConnectorClientErrorType {
  Unknown = "Unknown",
  Duplicate = "Duplicate",
  NotFound = "NotFound",
}

export class EdcConnectorClientError
  extends TypedError<EdcConnectorClientErrorType> {
  body?: ApiErrorDetail[];
}
