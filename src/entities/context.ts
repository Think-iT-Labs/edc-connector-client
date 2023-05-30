export interface Context {
  dct: string;
  edc: string;
  dcat: string;
  odrl: string;
  dspace: string;
}

export interface ContextProperties {
  "@context": Partial<Context>;
  "@type"?: string;
}
