export interface BaseDataAddress {
    [key: string]: string | undefined;
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
export interface S3StorageDataAddress extends BaseDataAddress {
    type: "AmazonS3";
    name?: string;
    bucketName?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}
export interface AzureStorageDataAddress extends BaseDataAddress {
    type: "AzureStorage";
    container?: string;
    account?: string;
    blobname?: string;
}
export declare type DataAddress = BaseDataAddress | HttpDataAddress | S3StorageDataAddress | AzureStorageDataAddress;
