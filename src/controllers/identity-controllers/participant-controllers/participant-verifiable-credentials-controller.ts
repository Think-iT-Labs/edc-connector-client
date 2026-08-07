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
    const actualContext = this.getActualContext(context);
    const query: Record<string, string> = {};

    if (type) {
      query.type = type;
    }

    return this.inner.request<VerifiableCredentialsResource[]>(
      actualContext.identity,
      {
        path: this.getBasePath(actualContext),
        method: "GET",
        query,
        authorization: actualContext.authorization,
      },
    );
  }

  updateVerifiableCredential(
    input: VerifiableCredentialManifest,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: this.getBasePath(actualContext),
      method: "PUT",
      body: input,
      authorization: actualContext.authorization,
    });
  }

  createVerifiableCredential(
    input: VerifiableCredentialManifest,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: this.getBasePath(actualContext),
      method: "POST",
      body: input,
      authorization: actualContext.authorization,
    });
  }

  sendVerifiableCredentialRequest(
    input: CredentialRequestDto,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/request`,
      method: "POST",
      body: input,
      authorization: actualContext.authorization,
    });
  }

  getVerifiableCredentialRequest(
    issuerPid: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<VerifiableCredentialsResource>(
      actualContext.identity,
      {
        path: `${this.getBasePath(actualContext)}/request/${issuerPid}`,
        method: "GET",
        authorization: actualContext.authorization,
      },
    );
  }

  getVerifiableCredential(
    credentialId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<VerifiableCredentialsResource>(
      actualContext.identity,
      {
        path: `${this.getBasePath(actualContext)}/${credentialId}`,
        method: "GET",
        authorization: actualContext.authorization,
      },
    );
  }

  deleteVerifiableCredential(
    credentialId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<string>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${credentialId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }
}
