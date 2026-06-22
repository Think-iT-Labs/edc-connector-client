import { EdcConnectorClientContext } from "../../../context";
import { KeyDescriptor, KeyPair } from "../../../entities/keypairs";
import { Inner } from "../../../inner";
import { IdentityBaseController } from "../identity-base-controller";

export class ParticipantKeyPairContoller extends IdentityBaseController {
  constructor(
    inner: Inner,
    public participantId: string,
    context?: EdcConnectorClientContext,
  ) {
    super(`participants/${participantId}/keypairs`, inner, context);
  }

  getKeyPair(keyPairId: string, context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<KeyPair>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${keyPairId}`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }

  queryAllKeyPairs(context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<KeyPair[]>(actualContext.identity, {
      path: this.getBasePath(actualContext),
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }

  createKeyPair(
    keyDescriptor: KeyDescriptor,
    makeDefault = false,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: this.getBasePath(actualContext),
      method: "PUT",
      body: keyDescriptor,
      query: {
        makeDefault: String(makeDefault),
      },
      apiToken: actualContext.apiToken,
    });
  }

  activateKeyPair(keyPairId: string, context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${keyPairId}/activate`,
      method: "POST",
      apiToken: actualContext.apiToken,
    });
  }

  revokeKeyPair(
    keyPairId: string,
    newKeyDescriptor: KeyDescriptor,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${keyPairId}/revoke`,
      method: "POST",
      body: newKeyDescriptor,
      apiToken: actualContext.apiToken,
    });
  }

  rotateKeyPair(
    keyPairId: string,
    duration?: number,
    newKeyDescriptor?: KeyDescriptor,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${keyPairId}/rotate`,
      method: "POST",
      body: newKeyDescriptor,
      query: {
        duration: String(duration),
      },
      apiToken: actualContext.apiToken,
    });
  }
}
