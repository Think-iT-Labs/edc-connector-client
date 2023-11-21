import { QuerySpec } from ".";
import { JsonLdId } from "./jsonld";

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

  get assetId(): string {
    return this.target;
  }

  get target(): string {
    const target = this.nestedOf(() => new JsonLdId(), 'odrl', 'target');
    return target?.id!!;
  }
}
