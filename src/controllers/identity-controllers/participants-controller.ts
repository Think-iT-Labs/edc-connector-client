import { EdcConnectorClientContext } from "../../context";
import { Participant, ParticipantInput } from "../../entities/participant";
import { Inner } from "../../inner";

export class ParticipantsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.#inner = inner;
    this.#context = context;
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<Participant[]>(actualContext.identity, {
      path: "/v1alpha/participants",
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }

  async create(input: ParticipantInput, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<{
      apiKey: string;
      clientId: string;
      clientSecret: string;
    }>(actualContext.identity, {
      path: "/v1alpha/participants",
      method: "POST",
      apiToken: actualContext.apiToken,
      body: input,
    });
  }

  async get(participantId: number, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<Participant>(actualContext.identity, {
      path: `/v1alpha/participants/${participantId}`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }
}
