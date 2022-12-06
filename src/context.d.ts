import { Addresses } from "./entities";
export declare class EdcConnectorClientContext implements Addresses {
    #private;
    constructor(apiToken: string, addresses: Addresses);
    get default(): string;
    get validation(): string;
    get ids(): string;
    get data(): string;
    get control(): string;
    get dataplane(): string;
    get public(): string;
    get apiToken(): string;
}
