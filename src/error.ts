import { TypedError } from "@think-it-labs/typed-error";

export enum EdcClientErrorType {
  Unknown = "Unknown",
  Duplicate = "Duplicate",
}

export class EdcClientError extends TypedError<EdcClientErrorType> {}
