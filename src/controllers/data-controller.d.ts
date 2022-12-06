import { EdcConnectorClientContext } from "../context";
import { Asset, AssetInput, Catalog, CatalogRequest, ContractAgreement, ContractDefinition, ContractDefinitionInput, ContractNegotiation, ContractNegotiationRequest, ContractNegotiationState, CreateResult, PolicyDefinition, PolicyDefinitionInput, QuerySpec, TransferProcess, TransferProcessInput } from "../entities";
import { Inner } from "../inner";
export declare class DataController {
    #private;
    constructor(inner: Inner);
    createAsset(context: EdcConnectorClientContext, input: AssetInput): Promise<CreateResult>;
    deleteAsset(context: EdcConnectorClientContext, assetId: string): Promise<void>;
    getAsset(context: EdcConnectorClientContext, assetId: string): Promise<Asset>;
    listAssets(context: EdcConnectorClientContext): Promise<Asset[]>;
    createPolicy(context: EdcConnectorClientContext, input: PolicyDefinitionInput): Promise<CreateResult>;
    deletePolicy(context: EdcConnectorClientContext, policyId: string): Promise<void>;
    getPolicy(context: EdcConnectorClientContext, policyId: string): Promise<PolicyDefinition>;
    queryAllPolicies(context: EdcConnectorClientContext, query?: QuerySpec): Promise<PolicyDefinition[]>;
    createContractDefinition(context: EdcConnectorClientContext, input: ContractDefinitionInput): Promise<CreateResult>;
    deleteContractDefinition(context: EdcConnectorClientContext, contractDefinitionId: string): Promise<void>;
    getContractDefinition(context: EdcConnectorClientContext, contractDefinitionId: string): Promise<ContractDefinition>;
    queryAllContractDefinitions(context: EdcConnectorClientContext, query?: QuerySpec): Promise<ContractDefinition[]>;
    requestCatalog(context: EdcConnectorClientContext, input: CatalogRequest): Promise<Catalog>;
    initiateContractNegotiation(context: EdcConnectorClientContext, input: ContractNegotiationRequest): Promise<CreateResult>;
    queryNegotiations(context: EdcConnectorClientContext, query?: QuerySpec): Promise<ContractNegotiation[]>;
    getNegotiation(context: EdcConnectorClientContext, negotiationId: string): Promise<ContractNegotiation>;
    getNegotiationState(context: EdcConnectorClientContext, negotiationId: string): Promise<ContractNegotiationState>;
    cancelNegotiation(context: EdcConnectorClientContext, negotiationId: string): Promise<void>;
    declineNegotiation(context: EdcConnectorClientContext, negotiationId: string): Promise<void>;
    getAgreementForNegotiation(context: EdcConnectorClientContext, negotiationId: string): Promise<ContractAgreement>;
    queryAllAgreements(context: EdcConnectorClientContext, query?: QuerySpec): Promise<ContractAgreement[]>;
    getAgreement(context: EdcConnectorClientContext, agreementId: string): Promise<ContractAgreement>;
    initiateTransfer(context: EdcConnectorClientContext, input: TransferProcessInput): Promise<CreateResult>;
    queryAllTransferProcesses(context: EdcConnectorClientContext, query?: QuerySpec): Promise<TransferProcess[]>;
}
