import { EdcConnectorClientContext } from "../../../context";
import {
  CredentialRequestDto,
  VerifiableCredentialManifest,
  VerifiableCredentialsResource,
} from "../../../entities/verifiable-credentials";
import { Inner } from "../../../inner";
import { IdentityBaseController } from "../identity-base-controller";

export class ParticipantVerifiableCredentialsController extends IdentityBaseController {
  constructor(
    inner: Inner,
    public participantId: string,
    context?: EdcConnectorClientContext,
  ) {
    super(`participants/${participantId}/credentials`, inner, context);
  }

  queryAllVerifiableCredential(
    type?: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);
    const query: Record<string, string> = {};

    if (type) {
      query.type = type;
    }

    return this.inner.request<VerifiableCredentialsResource[]>(
      actualContext.identity,
      {
        path: `${this.identity.getBasePath(actualContext)}`,
        method: "GET",
        query,
        apiToken: actualContext.apiToken,
      },
    );
  }

  updateVerifiableCredential(
    input: VerifiableCredentialManifest,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.identity.getBasePath(actualContext)}`,
      method: "PUT",
      body: input,
      apiToken: actualContext.apiToken,
    });
  }

  createVerifiableCredential(
    input: VerifiableCredentialManifest,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.identity.getBasePath(actualContext)}`,
      method: "POST",
      body: input,
      apiToken: actualContext.apiToken,
    });
  }

  sendVerifiableCredentialRequest(
    input: CredentialRequestDto,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.identity.getBasePath(actualContext)}/request`,
      method: "POST",
      body: input,
      apiToken: actualContext.apiToken,
    });
  }

  getVerifiableCredentialRequest(
    issuerPid: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<VerifiableCredentialsResource>(
      actualContext.identity,
      {
        path: `${this.identity.getBasePath(actualContext)}/request/${issuerPid}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      },
    );
  }

  getVerifiableCredential(
    credentialId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<VerifiableCredentialsResource>(
      actualContext.identity,
      {
        path: `${this.identity.getBasePath(actualContext)}/${credentialId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      },
    );
  }

  deleteVerifiableCredential(
    credentialId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<string>(actualContext.identity, {
      path: `${this.identity.getBasePath(actualContext)}/${credentialId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }
}
