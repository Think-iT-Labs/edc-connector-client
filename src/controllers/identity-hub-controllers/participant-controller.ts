import { EdcConnectorClientContext } from "../../context";
import {
  ParticipantInput,
  ParticipantRoleResponse,
} from "../../entities/identity-hub";
import { Inner } from "../../inner";

export class ParticipantController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;

  constructor(
    inner: Inner,
    public participantId: string,
    context?: EdcConnectorClientContext,
  ) {
    this.#inner = inner;
    this.#context = context;
  }

  async delete(context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<string>(actualContext.identity, {
      path: `/v1alpha/participants/${this.participantId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  updateroles(roles: string[], context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<ParticipantRoleResponse[]>(
      actualContext.identity,
      {
        path: `/v1alpha/participants/${this.participantId}/roles`,
        method: "PUT",
        body: roles,
        apiToken: actualContext.apiToken,
      },
    );
  }

  updateState(
    isActive: boolean,
    input: Omit<ParticipantInput, "participantId">,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;
    // to be fixed in docs
    const body: ParticipantInput = {
      ...input,
      participantId: this.participantId,
    };

    return this.#inner.request<string>(actualContext.identity, {
      path: `/v1alpha/participants/${this.participantId}/state`,
      method: "POST",
      query: { isActive: String(isActive) },
      body,
      apiToken: actualContext.apiToken,
    });
  }

  regenerateToken(
    input: Omit<ParticipantInput, "participantId">,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    // to be fixed in docs
    const body: ParticipantInput = {
      ...input,
      participantId: this.participantId,
    };

    return this.#inner.request<string>(actualContext.identity, {
      path: `/v1alpha/participants/${this.participantId}/token`,
      method: "POST",
      body,
      apiToken: actualContext.apiToken,
    });
  }
}
