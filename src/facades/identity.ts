import { ParticipantController } from "../controllers/identity-controllers/participant-controller";
import { ParticipantsController } from "../controllers/identity-controllers/participants-controller";
import { EdcController } from "../edc-controller";

export class IdentityController extends EdcController {
  get participants() {
    return new ParticipantsController(this.inner, this.context);
  }

  participant(participantId: string) {
    return new ParticipantController(this.inner, participantId, this.context);
  }
}
