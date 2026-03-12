import { JsonLdDocumentLoader } from "jsonld-document-loader";
import dspace2025Data from "./contexts/dspace-2025.json";
import edcDspaceData from "./contexts/edc-dspace.json";
import odrlProfileData from "./contexts/odrl-profile.json";

const loader = new JsonLdDocumentLoader();

loader.addStatic("https://w3id.org/edc/dspace/v0.0.1", edcDspaceData);
loader.addStatic("https://w3id.org/dspace/2025/1/context.jsonld", dspace2025Data);
loader.addStatic("https://w3id.org/dspace/2025/1/odrl-profile.jsonld", odrlProfileData);

// .build() returns a function compatible with jsonld's documentLoader option
export const documentLoader = loader.build();