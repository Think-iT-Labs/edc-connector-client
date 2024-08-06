import { CriterionInput, QuerySpec } from ".";
import { JsonLdId } from "./jsonld";

export interface FederatedCatalogCacheQuery {
  criteria?: CriterionInput[];
}

export interface CatalogRequest {
  counterPartyAddress: string;
  querySpec?: QuerySpec;
}

export interface DatasetRequest {
  "@id": string,
  counterPartyAddress: string;
  querySpec?: QuerySpec;
}

export class Catalog extends JsonLdId {

  get participantId(): string {
    return this.mandatoryValue('edc', 'participantId');
  }

  get datasets(): Dataset[] {
    return this.arrayOf(() => new Dataset(), 'dcat', 'dataset');
  }
}

export class Dataset extends JsonLdId {

  get offers(): Offer[] {
    return this.arrayOf(() => new Offer(), 'odrl', 'hasPolicy');
  }
}

export class Offer extends JsonLdId {

}
