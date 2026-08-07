import { DEFAULT_QUERY_SPEC } from "../../../constants";
import { EdcConnectorClientContext } from "../../../context";
import { QuerySpec } from "../../../entities";
import { DIDDocument, DIDService } from "../../../entities/DID";
import { Inner } from "../../../inner";
import { IdentityBaseController } from "../identity-base-controller";

export class ParticipantDIDsController extends IdentityBaseController {
  constructor(
    inner: Inner,
    public participantId: string,
    context?: EdcConnectorClientContext,
  ) {
    super(`participants/${participantId}/dids`, inner, context);
  }

  publishDID(did: string, context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    // NOTE: fix in docs
    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/publish`,
      method: "POST",
      body: { did },
      authorization: actualContext.authorization,
    });
  }

  getDIDs(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<DIDDocument[]>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/query`,
      method: "POST",
      body: query,
      authorization: actualContext.authorization,
    });
  }

  getDIDstate(did: string, context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    //NOTE: Check for doc error
    return this.inner.request<string>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/state`,
      method: "POST",
      body: { did },
      authorization: actualContext.authorization,
    });
  }

  unpublishDID(did: string, context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    // NOTE: fix in docs
    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/unpublish`,
      method: "POST",
      body: { did },
      authorization: actualContext.authorization,
    });
  }

  addDIDEndpoint(
    did: string,
    service: DIDService,
    autoPublish = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    // NOTE: fix in docs
    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${did}/endpoints`,
      method: "POST",
      query: {
        autoPublish: String(autoPublish),
      },
      body: service,
      authorization: actualContext.authorization,
    });
  }

  deleteDIDEndpoint(
    did: string,
    serviceId?: string, // NOTE: should be mandetory
    autoPublish = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    const query: Record<string, string> = {
      autoPublish: String(autoPublish),
    };

    if (serviceId) {
      query.serviceId = serviceId;
    }

    // NOTE: fix in docs
    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${did}/endpoints`,
      method: "DELETE",
      query,
      authorization: actualContext.authorization,
    });
  }

  replaceDIDEndpoint(
    did: string,
    autoPublish = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    // NOTE: fix in docs
    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${did}/endpoints`,
      method: "PATCH",
      query: {
        autoPublish: String(autoPublish),
      },
      authorization: actualContext.authorization,
    });
  }
}
