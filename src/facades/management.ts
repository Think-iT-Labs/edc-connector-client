import {
  AssetController,
  CatalogController,
  CatalogsController,
  ContractAgreementController,
  ContractDefinitionController,
  ContractNegotiationController,
  DataplaneController,
  EdrController,
  PolicyDefinitionController,
  SecretController,
  TransferProcessController,
} from "../controllers/management-controllers";
import { EdcConnectorClientContext } from "../context";
import { EdcController } from "../edc-controller";
import { JsonLdService } from "../entities";
import { Inner } from "../inner";

export class ManagementController extends EdcController {
  #jsonLdService: JsonLdService;

  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    super(inner, context);
    this.#jsonLdService = jsonLdService;
  }

  get assets() {
    return new AssetController(this.inner, this.#jsonLdService, this.context);
  }

  get catalogs() {
    return new CatalogsController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }

  get catalog() {
    return new CatalogController(this.inner, this.#jsonLdService, this.context);
  }

  get contractAgreements() {
    return new ContractAgreementController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }

  get contractDefinitions() {
    return new ContractDefinitionController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }

  get contractNegotiations() {
    return new ContractNegotiationController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }

  get dataplanes() {
    return new DataplaneController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }

  get edrs(): EdrController {
    return new EdrController(this.inner, this.#jsonLdService, this.context);
  }

  get secrets(): SecretController {
    return new SecretController(this.inner, this.#jsonLdService, this.context);
  }

  get policyDefinitions() {
    return new PolicyDefinitionController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }

  get transferProcesses() {
    return new TransferProcessController(
      this.inner,
      this.#jsonLdService,
      this.context,
    );
  }
}
