import { TypedError } from "@think-it-labs/typed-error";
// import { ApiErrorDetail } from "./entities";

export enum EdcConnectorClientErrorType {
  Unknown = "Unknown",
  Duplicate = "Duplicate",
  NotFound = "NotFound",
  BadRequest = "BadRequest",
  Unreachable = "Unreachable",
  BadGateway = "BadGateway",
}

export class EdcConnectorClientError
  extends TypedError<EdcConnectorClientErrorType> {
  // body?: ApiErrorDetail[];
  body?: string;
}
