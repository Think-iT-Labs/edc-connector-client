import { EdcConnectorClientContext } from "../../context";
import { Participant, ParticipantInput } from "../../entities/participant";
import { Inner } from "../../inner";

export class ParticipantsController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  static readonly BASE_PATH = "/v1alpha/participants";

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
      path: ParticipantsController.BASE_PATH,
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
      path: ParticipantsController.BASE_PATH,
      method: "POST",
      apiToken: actualContext.apiToken,
      body: input,
    });
  }

  async get(participantId: number, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<Participant>(actualContext.identity, {
      path: `${ParticipantsController.BASE_PATH}/${participantId}`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }
}
