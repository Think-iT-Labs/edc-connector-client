import { Policy } from "./policy";

export interface ContractAgreement {
  id: string;
  assetId: string;
  consumerAgentId: string;
  contractEndDate?: number;
  constractSigningDate?: number;
  constractStartDate?: number;
  policy: Policy;
  providerAgentId: string;
}
