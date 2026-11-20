import { JsonLdIdNode } from "./jsonld";
import { Policy } from "./policy";

export interface ContractAgreement extends JsonLdIdNode {
  policy: Policy;
  assetId: string;
  providerId: string;
  consumerId: string;
  contractSigningDate: number;
}
