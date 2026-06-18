import { EdcConnectorClientContext } from "../../context";
import { Participant, ParticipantInput } from "../../entities/participant";
import { Inner } from "../../inner";
import { IdentityBaseController } from "./identity-base-controller";

export class ParticipantsController extends IdentityBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("participants", inner, context);
  }

  async queryAll(
    query: { offset?: string; limit?: string } = {},
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<Participant[]>(actualContext.identity, {
      path: this.identity.getBasePath(actualContext),
      method: "GET",
      apiToken: actualContext.apiToken,
      query,
    });
  }

  async create(input: ParticipantInput, context?: EdcConnectorClientContext) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<{
      apiKey: string;
      clientId: string;
      clientSecret: string;
    }>(actualContext.identity, {
      path: this.identity.getBasePath(actualContext),
      method: "POST",
      apiToken: actualContext.apiToken,
      body: input,
    });
  }

  async get(participantId: number, context?: EdcConnectorClientContext) {
    const actualContext = this.identity.getActualContext(context);

    return this.inner.request<Participant>(actualContext.identity, {
      path: `${this.identity.getBasePath(actualContext)}/${participantId}`,
      method: "GET",
      apiToken: actualContext.apiToken,
    });
  }
}
