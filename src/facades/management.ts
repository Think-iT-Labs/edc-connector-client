import { Inner } from "../inner";
import {
  AssetController,
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

  get assetController() {
    return new AssetController(this.#inner);
  }
  get contractAgreementController() {
    return new ContractAgreementController(this.#inner);
  }
  get contractDefinitionController() {
    return new ContractDefinitionController(this.#inner);
  }
  get contractNegotiationController() {
    return new ContractNegotiationController(this.#inner);
  }
  get dataplaneController() {
    return new DataplaneController(this.#inner);
  }
  get policyDefinitionController() {
    return new PolicyDefinitionController(this.#inner);
  }
  get transferProcessController() {
    return new TransferProcessController(this.#inner);
  }
}
