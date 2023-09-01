export interface BaseDataAddress {
  [key: string]: string | undefined | any;
  type: string;
}

export interface HttpDataAddress extends BaseDataAddress {
  type: "HttpData";
  name?: string;
  path?: string;
  method?: string;
  baseUrl?: string;
  authKey?: string;
  authCode?: string;
  secretName?: string;
  proxyBody?: string;
  proxyPath?: string;
  proxyQueryParams?: string;
  proxyMethod?: string;
  contentType?: string;
}

export type DataAddress =
  | BaseDataAddress
  | HttpDataAddress;
