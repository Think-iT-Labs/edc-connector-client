import { DataAddress } from "./data-address";
import { JsonLdIdNode, JsonLdNode } from "./jsonld";

export interface Asset extends JsonLdIdNode {
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress?: DataAddress;
  dataplaneMetadata?: DataplaneMetadata;
}

export interface DataplaneMetadata extends JsonLdNode {
  properties?: AssetProperties;
  labels?: string[];
  profiles?: string[];
}

export interface AssetInput {
  "@type": "Asset" | "CatalogAsset";
  "@id"?: string;
  properties: AssetProperties;
  privateProperties?: AssetProperties;
  dataAddress?: DataAddress;
  dataplaneMetadata?: DataplaneMetadataInput;
}

export interface DataplaneMetadataInput {
  "@type": string;
  properties?: AssetProperties;
  labels?: string[];
  profiles?: string[];
}

export interface AssetProperties {
  [key: string]: string | undefined | any;
}
