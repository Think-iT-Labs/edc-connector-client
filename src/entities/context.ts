export interface Context {
  dct: string;
  edc: typeof EDC_CONTEXT;
  dcat: string;
  odrl: string;
  dspace: string;
}
export interface ContextProperties {
  "@context": Partial<Context>;
  "@type"?: string;
}

export const EDC_CONTEXT = "https://w3id.org/edc/v0.0.1/ns/";
