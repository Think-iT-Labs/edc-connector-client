import { DataAddressProperties } from "./data-address";

export interface Asset {
  '@id'?: string;
  properties: {
    [key: string]: string | undefined;
    "asset:prop:id": string;
    "asset:prop:name"?: string;
  };
  createdAt: string;
}

export interface AssetInput {
  asset: Omit<Asset, "createdAt">;
  dataAddress: DataAddressProperties;
}
