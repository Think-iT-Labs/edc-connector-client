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

export interface AssetInputV3 {
  "@id"?: string;
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress: DataAddress;
}

export interface AssetInputV4 {
  "@type": "Asset" | "CatalogAsset";
  "@id"?: string;
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress?: DataAddress;
  dataplaneMetadata?: {
    "@type": string;
    properties?: AssetProperties;
    labels?: string[];
  };
}

export type AssetInput = AssetInputV3 | AssetInputV4;

export interface AssetProperties {
  [key: string]: string | undefined | any;
}
