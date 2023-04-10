import { DataAddressProperties } from "./data-address";

export interface Asset {
  properties: {
    [key: string]: string | undefined;
    "asset:prop:id": string;
    "asset:prop:name"?: string;
  };
  createdAt: string;
  id: string;
}

export interface AssetInput {
  asset: Omit<Asset, "id" | "createdAt">;
  dataAddress: DataAddressProperties;
}
