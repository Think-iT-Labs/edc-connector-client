import { EdcConnectorClientContext } from "./context";
import { ManagementController, ObservabilityController, PublicController } from "./controllers";
import { Addresses } from "./entities";
export declare class EdcConnectorClient {
    readonly management: ManagementController;
    readonly observability: ObservabilityController;
    readonly public: PublicController;
    constructor();
    createContext(token: string, addresses: Addresses): EdcConnectorClientContext;
    static version(): string;
}
