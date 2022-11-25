import { DataAddress } from "./data-address";

export interface Dataplane {
  edctype: string;
  id: string;
  url: string;
  allowedSourceTypes: string[];
  allowedDestTypes: string[];
  properties: {
    publicApiUrl: string;
  };
}

export type DataplaneInput = Dataplane;

export interface SelectorRequest {
  destination?: DataAddress;
  source?: DataAddress;
  strategy?: string;
}
