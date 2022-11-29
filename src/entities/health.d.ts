export interface HealthStatus {
    componentResults: HealthCheckResult[];
    isSystemHealthy: boolean;
}
export interface HealthCheckResult {
    failure?: {
        messages: string[];
    };
    component?: string;
    isHealthy: boolean;
}
