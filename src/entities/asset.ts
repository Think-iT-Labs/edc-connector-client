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
  version: "v3";
  "@id"?: string;
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress: DataAddress;
}

export interface AssetInputV4 {
  version: "v4";
  "@context"?: {
    [key: string]: unknown;
  };
  "@type": "Asset" | "CatalogAsset";
  "@id"?: string;
  properties: {
    [key: string]: unknown;
  };
  dataplaneMetadata?: {
    "@type": string;
    properties?: {
      [key: string]: unknown;
    };
    labels?: string[];
  };
  privateProperties?: {
    [key: string]: unknown;
  };
}

export type AssetInput = AssetInputV3 | AssetInputV4;

interface AssetProperties {
  [key: string]: string | undefined | any;
}
