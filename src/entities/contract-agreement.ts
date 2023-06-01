import { Policy } from "./policy";
import { JsonLdId } from "./jsonld"

export class ContractAgreement extends JsonLdId {
  assetId?: string;
  consumerAgentId?: string;
  contractEndDate?: number;
  constractSigningDate?: number;
  constractStartDate?: number;
  policy?: Policy;
  providerAgentId?: string;
}
