import {
  AssetController,
  CatalogController,
  CatalogsController,
  ContractAgreementController,
  ContractDefinitionController,
  ContractNegotiationController,
  DataplaneController,
  PolicyDefinitionController,
  SecretController,
  TransferProcessController,
} from "../controllers/management-controllers";
import { EdcConnectorClientContext } from "../context";
import { EdcController } from "../edc-controller";
import { Inner } from "../inner";

export class ManagementController extends EdcController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context);
  }

  get assets() {
    return new AssetController(this.inner, this.context);
  }

  get catalogs() {
    return new CatalogsController(this.inner, this.context);
  }

  get catalog() {
    return new CatalogController(this.inner, this.context);
  }

  get contractAgreements() {
    return new ContractAgreementController(this.inner, this.context);
  }

  get contractDefinitions() {
    return new ContractDefinitionController(this.inner, this.context);
  }

  get contractNegotiations() {
    return new ContractNegotiationController(this.inner, this.context);
  }

  get dataplanes() {
    return new DataplaneController(this.inner, this.context);
  }

  get secrets(): SecretController {
    return new SecretController(this.inner, this.context);
  }

  get policyDefinitions() {
    return new PolicyDefinitionController(this.inner, this.context);
  }

  get transferProcesses() {
    return new TransferProcessController(this.inner, this.context);
  }
}
