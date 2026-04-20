export interface Context {
  dct?: string;
  edc: string;
  dcat?: string;
  odrl?: string;
  dspace?: string;
}
export interface ContextProperties {
  "@context": Context;
  "@type"?: string;
}

export const EDC_CONTEXT = "https://w3id.org/edc/v0.0.1/ns/";
export const JSON_LD_DEFAULT_CONTEXT = { "@vocab": EDC_CONTEXT };
export const MANAGEMENT_V2_CONTEXT =
  "https://w3id.org/edc/connector/management/v2";
