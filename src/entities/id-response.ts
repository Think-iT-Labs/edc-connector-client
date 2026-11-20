import { JsonLdIdNode } from "./jsonld";

export interface IdResponse extends JsonLdIdNode {
  createdAt: number;
}
