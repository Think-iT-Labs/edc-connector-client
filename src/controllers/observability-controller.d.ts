import { EdcClientContext } from "../context";
import { HealthStatus } from "../entities";
import { Inner } from "../inner";
export declare class ObservabilityController {
    #private;
    constructor(inner: Inner);
    checkHealth(context: EdcClientContext): Promise<HealthStatus>;
    checkLiveness(context: EdcClientContext): Promise<HealthStatus>;
    checkReadiness(context: EdcClientContext): Promise<HealthStatus>;
    checkStartup(context: EdcClientContext): Promise<HealthStatus>;
}
