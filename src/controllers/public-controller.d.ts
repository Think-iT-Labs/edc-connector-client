import { EdcConnectorClientContext } from "../context";
import { Inner } from "../inner";
export declare class PublicController {
    #private;
    constructor(inner: Inner);
    getTranferedData(context: EdcConnectorClientContext, headers: Record<string, string | undefined>): Promise<Response>;
}
