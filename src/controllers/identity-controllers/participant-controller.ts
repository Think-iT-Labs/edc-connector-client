import { EdcConnectorClientContext } from "../../context";
import {
  ParticipantInput,
  ParticipantRoleResponse,
} from "../../entities/participant";
import { Inner } from "../../inner";

export class ParticipantController {
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

  async delete(context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<string>(actualContext.identity, {
      path: `${ParticipantController.BASE_PATH}/${this.participantId}`,
      method: "DELETE",
      apiToken: actualContext.apiToken,
    });
  }

  updateRoles(roles: string[], context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<ParticipantRoleResponse[]>(
      actualContext.identity,
      {
        path: `${ParticipantController.BASE_PATH}/${this.participantId}/roles`,
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
      path: `${ParticipantController.BASE_PATH}/${this.participantId}/state`,
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
      path: `${ParticipantController.BASE_PATH}/${this.participantId}/token`,
      method: "POST",
      body,
      apiToken: actualContext.apiToken,
    });
  }
}
