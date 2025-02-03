import { EdcConnectorClientContext } from "../../../context";
import { KeyDescriptor, KeyPair } from "../../../entities/keypairs";
import { Inner } from "../../../inner";

export class ParticipantKeyPairContoller {
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

  getKeyPair(keyPairId: string, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<KeyPair>(actualContext.identity, {
      path: `${ParticipantKeyPairContoller.BASE_PATH}/${this.participantId}/keypairs/${keyPairId}`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }

  queryAllKeyPairs(context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<KeyPair[]>(actualContext.identity, {
      path: `${ParticipantKeyPairContoller.BASE_PATH}/${this.participantId}/keypairs`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }

  createKeyPair(
    keyDescriptor: KeyDescriptor,
    makeDefault = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantKeyPairContoller.BASE_PATH}/${this.participantId}/keypairs`,
      method: "PUT",
      body: keyDescriptor,
      query: {
        makeDefault: String(makeDefault),
      },
      apiToken: actualContext.apiToken,
    });
  }

  activate(keyPairId: string, context?: EdcConnectorClientContext) {
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantKeyPairContoller.BASE_PATH}/${this.participantId}/keypairs/${keyPairId}/activate`,
      method: "POST",
      apiToken: actualContext.apiToken,
    });
  }

  revoke(
    keyPairId: string,
    newKeyDescriptor: KeyDescriptor,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantKeyPairContoller.BASE_PATH}/${this.participantId}/keypairs/${keyPairId}/revoke`,
      method: "POST",
      body: newKeyDescriptor,
      apiToken: actualContext.apiToken,
    });
  }

  rotate(
    keyPairId: string,
    duration?: number,
    newKeyDescriptor?: KeyDescriptor,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.#context!;

    return this.#inner.request<void>(actualContext.identity, {
      path: `${ParticipantKeyPairContoller.BASE_PATH}/${this.participantId}/keypairs/${keyPairId}/rotate`,
      method: "POST",
      body: newKeyDescriptor,
      query: {
        duration: String(duration),
      },
      apiToken: actualContext.apiToken,
    });
  }
}
