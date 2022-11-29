import { Dataplane, DataplaneInput } from "../entities";
import { EdcClientContext } from "../context";
import { Inner } from "../inner";
export declare class DataplaneController {
    #private;
    constructor(inner: Inner);
    registerDataplane(context: EdcClientContext, input: DataplaneInput): Promise<void>;
    listDataplanes(context: EdcClientContext): Promise<Dataplane[]>;
}
