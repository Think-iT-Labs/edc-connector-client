import jsonld from "jsonld";
import dspace2025Data from "./entities/jsonld/contexts/dspace-2025.json";
import edcDspaceData from "./entities/jsonld/contexts/edc-dspace.json";
import odrlProfileData from "./entities/jsonld/contexts/odrl-profile.json";
import managementV2Data from "./entities/jsonld/contexts/management-v2.json";
import { EDC_CONTEXT, MANAGEMENT_V2_CONTEXT } from "./entities/context";

const CONTEXT = { "@vocab": EDC_CONTEXT };

export class JsonLdService {
  readonly #defaultContexts: Record<string, object> = {
    "https://w3id.org/edc/dspace/v0.0.1": edcDspaceData,
    "https://w3id.org/dspace/2025/1/context.jsonld": dspace2025Data,
    "https://w3id.org/dspace/2025/1/odrl-profile.jsonld": odrlProfileData,
    [MANAGEMENT_V2_CONTEXT]: managementV2Data,
  };
  readonly #cachedContexts: Record<string, object>;

  constructor(additionalContexts: Record<string, object> = {}) {
    this.#cachedContexts = { ...this.#defaultContexts, ...additionalContexts };
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

  #documentLoader = (url: string, options: any): any => {
    if (this.#cachedContexts[url]) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: this.#cachedContexts[url],
      };
    }

    const loaders = (jsonld as any).documentLoaders;
    const defaultLoader =
      typeof window === "undefined" ? loaders.node() : loaders.xhr();

    return defaultLoader(url, options);
  };
}
