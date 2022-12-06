import { EdcConnectorClientContext } from "../context";
import { HealthStatus } from "../entities";
import { Inner } from "../inner";
export declare class ObservabilityController {
    #private;
    constructor(inner: Inner);
    checkHealth(context: EdcConnectorClientContext): Promise<HealthStatus>;
    checkLiveness(context: EdcConnectorClientContext): Promise<HealthStatus>;
    checkReadiness(context: EdcConnectorClientContext): Promise<HealthStatus>;
    checkStartup(context: EdcConnectorClientContext): Promise<HealthStatus>;
}
