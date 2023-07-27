import { Policy } from "./policy";
import { JsonLdId, JsonLdValue } from "./jsonld"

export class ContractAgreement extends JsonLdId {
  'https://w3id.org/edc/v0.0.1/ns/assetId': JsonLdValue<string>[];
  consumerAgentId?: string;
  contractEndDate?: number;
  constractSigningDate?: number;
  constractStartDate?: number;
  policy?: Policy;
  providerAgentId?: string;

  get assetId(): string {
    return this['https://w3id.org/edc/v0.0.1/ns/assetId']
      .map(it => Object.assign(new JsonLdValue(), it))[0]
      .value
  }

}
