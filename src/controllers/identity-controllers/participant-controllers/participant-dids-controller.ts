import { EdcConnectorClientContext } from "../../../context";
import { QuerySpec } from "../../../entities";
import { DIDDocument, DIDService } from "../../../entities/DID";
import { Inner } from "../../../inner";

export class ParticipantDIDsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  static readonly BASE_PATH = "/v1alpha/participants";

  constructor(
    inner: Inner,
    public participantId: string,
    context?: EdcConnectorClientContext,
  ) {
    this.#inner = inner;
    this.#context = context;
  }

  publishDID(did: string, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    // NOTE: fix in docs
    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/publish`,
      method: "POST",
      body: { did },
      apiToken: actualContext.apiToken,
    });
  }

  getDIDs(query: QuerySpec, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<DIDDocument[]>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/query`,
      method: "POST",
      body: query,
      apiToken: actualContext.apiToken,
    });
  }

  getDIDstate(did: string, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    //NOTE: Check for doc error
    return this.#inner.request<string>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/state`,
      method: "POST",
      body: { did },
      apiToken: actualContext.apiToken,
    });
  }

  unpublishDID(did: string, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    // NOTE: fix in docs
    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/unpublish`,
      method: "POST",
      body: { did },
      apiToken: actualContext.apiToken,
    });
  }

  addDIDEndpoint(
    did: string,
    service: DIDService,
    autoPublish = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    // NOTE: fix in docs
    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/${did}/endpoints`,
      method: "POST",
      query: {
        autoPublish: String(autoPublish),
      },
      body: service,
      apiToken: actualContext.apiToken,
    });
  }

  deleteDIDEndpoint(
    did: string,
    serviceId?: string, // NOTE: should be mandetory
    autoPublish = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    const query: Record<string, string> = {
      autoPublish: String(autoPublish),
    };

    if (serviceId) {
      query.serviceId = serviceId;
    }

    // NOTE: fix in docs
    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/${did}/endpoints`,
      method: "DELETE",
      query,
      apiToken: actualContext.apiToken,
    });
  }

  replaceDIDEndpoint(
    did: string,
    autoPublish = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    // NOTE: fix in docs
    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantDIDsController.BASE_PATH}/${this.participantId}/dids/${did}/endpoints`,
      method: "PATCH",
      query: {
        autoPublish: String(autoPublish),
      },
      apiToken: actualContext.apiToken,
    });
  }
}
