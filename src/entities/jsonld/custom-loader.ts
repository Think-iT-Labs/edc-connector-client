import { documentLoaderFactory } from "@transmute/jsonld-document-loader";
import dspace2025Data from "./contexts/dspace-2025.json";
import edcDspaceData from "./contexts/edc-dspace.json";
import odrlProfileData from "./contexts/odrl-profile.json";

const JSONLD_CONTEXTS: Record<string, object> = {
  "https://w3id.org/edc/dspace/v0.0.1": edcDspaceData,
  "https://w3id.org/dspace/2025/1/context.jsonld": dspace2025Data,
  "https://w3id.org/dspace/2025/1/odrl-profile.jsonld": odrlProfileData,
};

export const documentLoader = documentLoaderFactory
  .builder()
  .addContexts(JSONLD_CONTEXTS)
  .build();