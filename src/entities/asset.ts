import { EDC_NAMESPACE } from ".";
import { DataAddress } from "./data-address";
import { ContextProperties } from "./context";
import { IdResponse } from "./id-response";
export interface Asset {
  properties: AssetProperties;
  createdAt: string;
  "@id": string;
}

interface AssetProperties {
  [key: string]: string | undefined | any;
  name?: string;
  description?: string;
  contenttype?: string;
}

export interface AssetInput extends Partial<Asset> {
  dataAddress: Partial<DataAddress> & { properties?: Partial<DataAddress> };
}

export type AssetResponse = {
  [K in keyof AssetProperties as `${typeof EDC_NAMESPACE}:${string &
    K}`]: AssetProperties[K];
} & ContextProperties &
  IdResponse;
