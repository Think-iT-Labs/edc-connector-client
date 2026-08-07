import { EdcConnectorClientContext } from "../../../context";
import {
  ParticipantInput,
  ParticipantRoleResponse,
} from "../../../entities/participant";
import { Inner } from "../../../inner";
import { IdentityBaseController } from "../identity-base-controller";
import { ParticipantDIDsController } from "./participant-dids-controller";
import { ParticipantKeyPairContoller } from "./participant-keypairs-controller";
import { ParticipantVerifiableCredentialsController } from "./participant-verifiable-credentials-controller";

export class ParticipantController extends IdentityBaseController {
  constructor(
    inner: Inner,
    public participantId: string,
    context?: EdcConnectorClientContext,
  ) {
    super(`participants/${participantId}`, inner, context);
  }

  async delete(context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<string>(actualContext.identity, {
      path: this.getBasePath(actualContext),
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }

  updateRoles(roles: string[], context?: EdcConnectorClientContext) {
    const actualContext = this.getActualContext(context);

    return this.inner.request<ParticipantRoleResponse[]>(
      actualContext.identity,
      {
        path: `${this.getBasePath(actualContext)}/roles`,
        method: "PUT",
        body: roles,
        authorization: actualContext.authorization,
      },
    );
  }

  updateState(
    isActive: boolean,
    input: Omit<ParticipantInput, "participantId">,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);
    // to be fixed in docs
    const body: ParticipantInput = {
      ...input,
      participantId: this.participantId,
    };

    return this.inner.request<string>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/state`,
      method: "POST",
      query: { isActive: String(isActive) },
      body,
      authorization: actualContext.authorization,
    });
  }

  regenerateToken(
    input: Omit<ParticipantInput, "participantId">,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.getActualContext(context);

    // to be fixed in docs
    const body: ParticipantInput = {
      ...input,
      participantId: this.participantId,
    };

    return this.inner.request<string>(actualContext.identity, {
      path: `${this.getBasePath(actualContext)}/token`,
      method: "POST",
      body,
      authorization: actualContext.authorization,
    });
  }

  get keypairs() {
    return new ParticipantKeyPairContoller(
      this.inner,
      this.participantId,
      this.context,
    );
  }

  get dids() {
    return new ParticipantDIDsController(
      this.inner,
      this.participantId,
      this.context,
    );
  }

  get verifiableCredentials() {
    return new ParticipantVerifiableCredentialsController(
      this.inner,
      this.participantId,
      this.context,
    );
  }
}
