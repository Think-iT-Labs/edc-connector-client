import { DIDsController } from "../controllers/identity-controllers/dids-controller";
import { KeyPairsController } from "../controllers/identity-controllers/keypairs-controller";
import { ParticipantController } from "../controllers/identity-controllers/participant-controllers/participant-controller";
import { ParticipantsController } from "../controllers/identity-controllers/participants-controller";
import { EdcController } from "../edc-controller";

export class IdentityController extends EdcController {
  get participants() {
    return new ParticipantsController(this.inner, this.context);
  }

  participant(participantId: string) {
    return new ParticipantController(this.inner, participantId, this.context);
  }

  get keyPairs() {
    return new KeyPairsController(this.inner, this.context);
  }

  get DIDs() {
    return new DIDsController(this.inner, this.context);
  }
}
