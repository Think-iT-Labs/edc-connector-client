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
      authorization: actualContext.authorization,
    });
  }

  queryAllKeyPairs(context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<KeyPair[]>(actualContext.identity, {
      path: this.getBasePath(actualContext),
      method: "GET",
      authorization: actualContext.authorization,
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
      authorization: actualContext.authorization,
    });
  }

  activateKeyPair(keyPairId: string, context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<void>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/${keyPairId}/activate`,
      method: "POST",
      authorization: actualContext.authorization,
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
      authorization: actualContext.authorization,
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
      authorization: actualContext.authorization,
    });
  }
}
