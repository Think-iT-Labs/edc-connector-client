import { QuerySpec } from ".";
import { ContractOffer } from "./contract-offer";
import { JsonLdId, JsonLdValue } from "./jsonld";

export interface Catalog {
  id: string;
  contractOffers: ContractOffer[];
}

export interface CatalogRequest {
  providerUrl: string;
  querySpec?: QuerySpec;
}

export class DCATCatalog extends JsonLdId {
  "https://www.w3.org/ns/dcat/dataset": Dataset[];

  getDatasets(): Dataset[] {
    return this["https://www.w3.org/ns/dcat/dataset"].map((it) =>
      Object.assign(new Dataset(), it),
    );
  }
}

export class Dataset extends JsonLdId {
  "http://www.w3.org/ns/odrl/2/hasPolicy": Offer[];

  getOffers(): Offer[] {
    return this["http://www.w3.org/ns/odrl/2/hasPolicy"].map((it) =>
      Object.assign(new Offer(), it),
    );
  }
}

export class Offer extends JsonLdId {
  "http://www.w3.org/ns/odrl/2/target": JsonLdValue[];

  getAssetId(): string {
    return this.getTarget().value();
  }

  assetId() {
    return this.id().split(":")[1];
  }

  getTarget(): JsonLdValue {
    return this["http://www.w3.org/ns/odrl/2/target"].map((it) =>
      Object.assign(new JsonLdValue(), it),
    )[0];
  }
}
