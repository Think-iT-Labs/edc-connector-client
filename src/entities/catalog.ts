import { QuerySpec } from ".";
import { JsonLdId, JsonLdValue } from "./jsonld";

export interface CatalogRequest {
  providerUrl: string;
  querySpec?: QuerySpec;
}

export type CatalogRequestinput = Pick<CatalogRequest, "providerUrl">;

export class Catalog extends JsonLdId {
  "https://www.w3.org/ns/dcat/dataset": Dataset[];

  get datasets(): Dataset[] {
    return this["https://www.w3.org/ns/dcat/dataset"].map((it) =>
      Object.assign(new Dataset(), it),
    );
  }
}

export class Dataset extends JsonLdId {
  "http://www.w3.org/ns/odrl/2/hasPolicy": Offer[];

  get offers(): Offer[] {
    return this["http://www.w3.org/ns/odrl/2/hasPolicy"].map((it) =>
      Object.assign(new Offer(), it),
    );
  }
}

export class Offer extends JsonLdId {
  "http://www.w3.org/ns/odrl/2/target": JsonLdValue<string>[];

  get assetId(): string {
    return this.target;
  }

  get target(): string {
    return this["http://www.w3.org/ns/odrl/2/target"].map((it) =>
      Object.assign(new JsonLdValue(), it),
    )[0].value;
  }
}
