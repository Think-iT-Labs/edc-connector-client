import { Inner } from "../inner";
import {
  AssetController,
  CatalogController,
  ContractAgreementController,
  ContractDefinitionController,
  ContractNegotiationController,
  DataplaneController,
  PolicyDefinitionController,
  TransferProcessController,
} from "../controllers/management-controllers";

export class ManagementController {
  #inner: Inner;

  constructor(inner: Inner) {
    this.#inner = inner;
  }

  get assets() {
    return new AssetController(this.#inner);
  }
  get catalog() {
    return new CatalogController(this.#inner);
  }
  get contractAgreements() {
    return new ContractAgreementController(this.#inner);
  }
  get contractDefinitions() {
    return new ContractDefinitionController(this.#inner);
  }
  get contractNegotiations() {
    return new ContractNegotiationController(this.#inner);
  }
  get dataplanes() {
    return new DataplaneController(this.#inner);
  }
  get policyDefinitions() {
    return new PolicyDefinitionController(this.#inner);
  }
  get transferProcesses() {
    return new TransferProcessController(this.#inner);
  }
}
