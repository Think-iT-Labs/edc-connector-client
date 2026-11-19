import { QuerySpec } from ".";
import { JsonLdIdNode, JsonLdNode } from "./jsonld";
import { Policy } from "./policy";

export interface CatalogRequest {
  "@type"?: "CatalogRequest";
  counterPartyAddress: string;
  counterPartyId: string;
  protocol?: string;
  profile?: string;
  additionalScopes?: string[];
  querySpec?: QuerySpec;
}

export interface DatasetRequest {
  "@type"?: "DatasetRequest";
  "@id": string;
  counterPartyAddress: string;
  counterPartyId: string;
  protocol?: string;
  profile?: string;
  additionalScopes?: string[];
  querySpec?: QuerySpec;
}

export interface Catalog extends JsonLdIdNode {
  participantId?: string;
  dataset?: Dataset[];
  catalog?: Catalog[];
  service?: DataService[];
  distribution?: Distribution[];
  /** @deprecated since 0.12.0: use `dataset`, which is absent when empty */
  readonly datasets: Dataset[];
}

export interface Dataset extends JsonLdIdNode {
  hasPolicy: Offer[];
  distribution?: Distribution[];
  /** @deprecated since 0.12.0: use `hasPolicy` */
  readonly offers: Offer[];
}

export interface Offer extends Policy {
  "@id": string;
  /** @deprecated since 0.12.0: use `["@id"]` */
  readonly id: string;
}

export interface Distribution extends JsonLdNode {
  format: string;
  accessService: DataService;
}

export interface DataService extends JsonLdNode {
  endpointURL?: string;
  endpointDescription?: string;
}
