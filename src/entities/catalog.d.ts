import { QuerySpec } from ".";
import { ContractOffer } from "./contract-offer";
export interface Catalog {
    id: string;
    contractOffers: ContractOffer[];
}
export interface CatalogRequest {
    providerUrl: string;
    querySpec?: QuerySpec;
}
