import { KeyPairsController } from "../controllers/identity-controllers/keypairs-controller";
import { ParticipantController } from "../controllers/identity-controllers/participant-controllers/participant-controller";
import { ParticipantsController } from "../controllers/identity-controllers/participants-controller";
import { EdcController } from "../edc-controller";

export class IdentityController extends EdcController {
  get participants() {
    return new ParticipantsController(this.inner, this.context);
  }

  get participant() {
    return (participantId: string) =>
      new ParticipantController(this.inner, participantId, this.context);
  }

  get keyPairs() {
    return new KeyPairsController(this.inner, this.context);
  }
}