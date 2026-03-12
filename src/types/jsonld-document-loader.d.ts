declare module 'jsonld-document-loader' {
  export class JsonLdDocumentLoader {
    constructor();
    addStatic(url: string, document: object): void;
    build(): (url: string, options?: any) => Promise<import('jsonld').RemoteDocument>;
  }
}