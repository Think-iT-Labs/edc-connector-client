import { Dataplane, DataplaneInput } from "../entities";
import { EdcConnectorClientContext } from "../context";
import { Inner } from "../inner";
export declare class DataplaneController {
    #private;
    constructor(inner: Inner);
    registerDataplane(context: EdcConnectorClientContext, input: DataplaneInput): Promise<void>;
    listDataplanes(context: EdcConnectorClientContext): Promise<Dataplane[]>;
}
