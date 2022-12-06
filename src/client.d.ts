import { EdcConnectorClientContext } from "./context";
import { DataController, DataplaneController, ObservabilityController } from "./controllers";
import { Addresses } from "./entities";
export declare class EdcConnectorClient {
    readonly data: DataController;
    readonly dataplane: DataplaneController;
    readonly observability: ObservabilityController;
    constructor();
    createContext(token: string, addresses: Addresses): EdcConnectorClientContext;
    static version(): string;
}
