import { JsonLdIdNode } from "./jsonld";

/**
 * Body of a V4 Data Plane Signaling registration request
 * (`PUT /{version}/dataplanes`). Unlike most management payloads this is a
 * plain JSON object, not a JSON-LD document, so it carries no `@context`/`@type`.
 */
export interface DataplaneRegistrationInput {
  dataplaneId: string;
  endpoint: string;
  transferTypes?: string[];
  labels?: string[];
  authorization?: Record<string, unknown>;
}

export interface Dataplane extends JsonLdIdNode {
  url: string;
  allowedSourceTypes?: string[];
  allowedTransferTypes?: string[];
  destinationProvisionTypes?: string[];
  state?: string;
  stateTimestamp?: number;
  lastActive?: number;
  properties?: Record<string, any>;
}
