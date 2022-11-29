import { Asset } from "./asset";
import { Policy } from "./policy";
export interface ContractOffer {
    asset?: Asset;
    policy?: Policy;
    consumer?: string;
    provider?: string;
    contractEnd?: string;
    contractStart?: string;
    id?: string;
    offerEnd?: string;
    offerStart?: string;
}
