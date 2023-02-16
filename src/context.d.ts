import { Addresses } from "./entities";
export declare class EdcConnectorClientContext implements Addresses {
    #private;
    constructor(apiToken: string, addresses: Addresses);
    get default(): string;
    get protocol(): string;
    get management(): string;
    get control(): string;
    get public(): string;
    get apiToken(): string;
}
