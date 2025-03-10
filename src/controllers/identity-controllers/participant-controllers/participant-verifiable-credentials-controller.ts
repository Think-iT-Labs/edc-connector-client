import { EdcConnectorClientContext } from "../../../context";
import {
  CredentialRequestDto,
  VerifiableCredentialManifest,
  VerifiableCredentialsResource,
} from "../../../entities/verifiable-credentials";
import { Inner } from "../../../inner";

export class ParticipantVerifiableCredentialsController {
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

  queryAllVerifiableCredential(
    type?: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;
    const query: Record<string, string> = {};

    if (type) {
      query.type = type;
    }

    return this.#inner.request<VerifiableCredentialsResource[]>(
      actualContext.identity,
      {
        path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials`,
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
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials`,
      method: "PUT",
      body: input,
      apiToken: actualContext.apiToken,
    });
  }

  createVerifiableCredential(
    input: VerifiableCredentialManifest,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials`,
      method: "POST",
      body: input,
      apiToken: actualContext.apiToken,
    });
  }

  sendVerifiableCredentialRequest(
    input: CredentialRequestDto,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials/request`,
      method: "POST",
      body: input,
      apiToken: actualContext.apiToken,
    });
  }

  getVerifiableCredentialRequest(
    issuerPid: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<VerifiableCredentialsResource>(
      actualContext.identity,
      {
        path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials/request/${issuerPid}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      },
    );
  }

  getVerifiableCredential(
    credentialId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<VerifiableCredentialsResource>(
      actualContext.identity,
      {
        path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials/${credentialId}`,
        method: "GET",
        apiToken: actualContext.apiToken,
      },
    );
  }

  deleteVerifiableCredential(
    credentialId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<string>(actualContext.identity, {
      path: `${ParticipantVerifiableCredentialsController.BASE_PATH}/${this.participantId}/credentials/${credentialId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }
}
