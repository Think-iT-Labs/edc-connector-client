import jsonld from "jsonld";
import { EDC_CONTEXT } from "./entities/context";

const CONTEXT = { "@vocab": EDC_CONTEXT };

type RemoteDocument = {
  contextUrl?: string;
  documentUrl: string;
  document: any;
};

export class JsonLdService {
  readonly #cache = new Map<string, RemoteDocument>();

  constructor(cachedContexts: Record<string, object> = {}) {
    for (const [url, document] of Object.entries(cachedContexts)) {
      this.#cache.set(url, { documentUrl: url, document });
    }
  }

  async compact(body: any): Promise<jsonld.NodeObject> {
    return await jsonld.compact(body, CONTEXT, {
      documentLoader: this.#documentLoader,
    });
  }

  async expand<T extends object>(body: any, newInstance: () => T): Promise<T> {
    const expanded = await jsonld.expand(body, {
      documentLoader: this.#documentLoader,
    });
    return Object.assign(newInstance(), expanded[0]);
  }

  async expandArray<T extends object>(
    body: any,
    newInstance: () => T,
  ): Promise<T[]> {
    const expanded = await jsonld.expand(body, {
      documentLoader: this.#documentLoader,
    });
    return (expanded as Array<any>).map((element) =>
      Object.assign(newInstance(), element),
    );
  }

  #documentLoader = async (
    url: string,
    options: any,
  ): Promise<RemoteDocument> => {
    const cached = this.#cache.get(url);
    if (cached) {
      return cached;
    }

    const loaders = (jsonld as any).documentLoaders;
    const defaultLoader =
      typeof window === "undefined" ? loaders.node() : loaders.xhr();

    const document: RemoteDocument = await defaultLoader(url, options);
    this.#cache.set(url, document);
    return document;
  };
}
