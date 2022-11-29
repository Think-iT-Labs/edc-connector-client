import { EdcClientContext } from "./context";
import { DataController, DataplaneController, ObservabilityController } from "./controllers";
import { Addresses } from "./entities";
export declare class EdcClient {
    readonly data: DataController;
    readonly dataplane: DataplaneController;
    readonly observability: ObservabilityController;
    constructor();
    createContext(token: string, addresses: Addresses): EdcClientContext;
    static version(): string;
}
