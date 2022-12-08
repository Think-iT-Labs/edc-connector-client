import { EdcConnectorClientContext } from "./context";
import { DataController, DataplaneController, ObservabilityController, PublicController } from "./controllers";
import { Addresses } from "./entities";
export declare class EdcConnectorClient {
    readonly data: DataController;
    readonly dataplane: DataplaneController;
    readonly observability: ObservabilityController;
    readonly public: PublicController;
    constructor();
    createContext(token: string, addresses: Addresses): EdcConnectorClientContext;
    static version(): string;
}
