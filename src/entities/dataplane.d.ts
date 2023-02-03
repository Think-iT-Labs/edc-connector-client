export interface Dataplane {
    id: string;
    url: string;
    lastActive: number;
    turnCount: number;
    allowedSourceTypes: string[];
    allowedDestTypes: string[];
    properties: {
        publicApiUrl: string;
    };
}
export declare type DataplaneInput = Omit<Dataplane, "lastActive" | "turnCount">;
