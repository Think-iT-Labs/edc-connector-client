import { CreateResult, EDC_NAMESPACE } from ".";
import { DataAddress } from "./data-address";
import { ContextProperties } from "./context";
export interface Asset {
  properties: AssetProperties;
  createdAt: string;
  "@id": string;
}

interface AssetProperties {
  [key: string]: string | undefined;
  name?: string;
  description?: string;
  contenttype?: string;
}

export interface AssetInput extends ContextProperties {
  asset: Partial<Asset>;
  dataAddress: Partial<DataAddress>;
}

export type AssetResponse = {
  [K in keyof AssetProperties as `${typeof EDC_NAMESPACE}:${string &
    K}`]: AssetProperties[K];
} & ContextProperties &
  CreateResult;
