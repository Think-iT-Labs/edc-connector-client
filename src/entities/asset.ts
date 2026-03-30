import { DataAddress } from "./data-address";
import { JsonLdId, JsonLdObject } from "./jsonld";

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
}

export interface AssetInput {
  "@type": "Asset" | "CatalogAsset";
  "@id"?: string;
  dataplaneMetadata?: {
    "@type": string;
    properties?: AssetProperties;
    labels?: string[];
  };
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress?: DataAddress;
}

interface AssetProperties {
  [key: string]: string | undefined | any;
}
