import { DataAddress } from "./data-address";
import { JsonLdId, JsonLdObject, JsonLdValue } from "./jsonld";

export class Asset extends JsonLdId {
  get properties(): JsonLdObject {
    return this.nested("edc", "properties");
  }

  get privateProperties(): JsonLdObject {
    return this.nested("edc", "privateProperties");
  }

  get dataAddress(): JsonLdObject {
    return this.nested("edc", "dataAddress");
  }

  get dataplaneMetadata(): DataplaneMetadata | undefined {
    return this.nestedOf(
      () => new DataplaneMetadata(),
      "edc",
      "dataplaneMetadata",
    );
  }
}

export class DataplaneMetadata extends JsonLdObject {
  get properties(): AssetProperties {
    // EDC serializes dataplaneMetadata.properties as a `@json` literal, so the
    // map is carried verbatim under `@value` rather than as namespaced terms.
    const nested = this.nestedOf(() => new JsonLdObject(), "edc", "properties");
    return (nested?.["@value"] as AssetProperties) ?? {};
  }

  get labels(): string[] {
    return this.arrayOf(() => new JsonLdValue<string>(), "edc", "labels").map(
      (it) => it.value,
    );
  }

  get profiles(): string[] {
    return this.arrayOf(() => new JsonLdValue<string>(), "edc", "profiles").map(
      (it) => it.value,
    );
  }
}

export interface AssetInput {
  "@type": "Asset" | "CatalogAsset";
  "@id"?: string;
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress?: DataAddress;
  dataplaneMetadata?: {
    "@type": string;
    properties?: AssetProperties;
    labels?: string[];
    profiles?: string[];
  };
}

export interface AssetProperties {
  [key: string]: string | undefined | any;
}
