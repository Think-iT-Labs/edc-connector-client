declare module "jsonld/lib/documentLoaders/node.js" {
  const loader: (
    url: string,
    options?: any
  ) => Promise<{
    contextUrl: string | null;
    documentUrl: string;
    document: unknown;
  }>;
  export default loader;
}