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

type DefaultContextValues = Pick<Context, "edc">;
export const defaultContextValues: DefaultContextValues = {
  edc: EDC_CONTEXT,
};
