import { Inner } from "../inner";
import { EdcConnectorClientContext } from "../context";
import {
  AssetController,
  CatalogController,
  ContractAgreementController,
  ContractDefinitionController,
  ContractNegotiationController,
  DataplaneController,
  EdrController,
  PolicyDefinitionController,
  SecretController,
  TransferProcessController,
} from "../controllers/management-controllers";

export class ManagementController {
  #inner: Inner;
  #context: EdcConnectorClientContext | undefined;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  get assets() {
    return new AssetController(this.#inner, this.#context);
  }
  get catalog() {
    return new CatalogController(this.#inner, this.#context);
  }
  get contractAgreements() {
    return new ContractAgreementController(this.#inner, this.#context);
  }
  get contractDefinitions() {
    return new ContractDefinitionController(this.#inner, this.#context);
  }
  get contractNegotiations() {
    return new ContractNegotiationController(this.#inner, this.#context);
  }
  get dataplanes() {
    return new DataplaneController(this.#inner, this.#context);
  }
  get edrs(): EdrController {
    return new EdrController(this.#inner, this.#context);
  }
  get secrets(): SecretController {
    return new SecretController(this.#inner, this.#context);
  }
  get policyDefinitions() {
    return new PolicyDefinitionController(this.#inner, this.#context);
  }
  get transferProcesses() {
    return new TransferProcessController(this.#inner, this.#context);
  }
}
