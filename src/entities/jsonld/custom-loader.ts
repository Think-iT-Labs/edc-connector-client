import jsonld from "jsonld";
import dspace2025Data from "./contexts/dspace-2025.json";
import edcDspaceData from "./contexts/edc-dspace.json";
import odrlProfileData from "./contexts/odrl-profile.json";

const JSONLD_CONTEXTS: Record<string, object> = {
  "https://w3id.org/edc/dspace/v0.0.1": edcDspaceData,
  "https://w3id.org/dspace/2025/1/context.jsonld": dspace2025Data,
  "https://w3id.org/dspace/2025/1/odrl-profile.jsonld": odrlProfileData,
};

const defaultLoader = (jsonld as any).documentLoaders.node();

export const documentLoader = async (url: string, options: any) => {
  if (JSONLD_CONTEXTS[url]) {
    const doc = JSONLD_CONTEXTS[url];
    return { contextUrl: null, documentUrl: url, document: doc };
  }
  return defaultLoader(url, options);
};
