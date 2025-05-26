import { EdcConnectorClientContext } from "../context"
import { PresentationQueryMessage, PresentationResponseMessage } from "../entities/presentation"
import { Inner } from "../inner"

export class PresentationController {
  #inner: Inner
  #context?: EdcConnectorClientContext
  static readonly BASE_PATH = "/v1/participants"

  constructor(
    inner: Inner,
    context?: EdcConnectorClientContext
  ) {
    this.#inner = inner
    this.#context = context
  }


  queryAll(participantId: string, auth: string, queryMessage: PresentationQueryMessage, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!

    return this.#inner.request<PresentationResponseMessage>(actualContext?.presentation, {
      method: "POST",
      path: `${PresentationController.BASE_PATH}/${participantId}/presentations/query`,
      headers: {
        Authorization: auth
      },
      body: queryMessage
    })
  }
}


