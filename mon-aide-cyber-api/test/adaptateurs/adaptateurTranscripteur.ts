import { AdaptateurTranscripteur } from "../../src/adaptateurs/AdaptateurTranscripteur";

import { Transcripteur } from "../../src/api/representateurs/types";

export class AdaptateurTranscripteurDeTest implements AdaptateurTranscripteur {
  transcripteur(): Transcripteur {
    return { contexte: { questions: [{ identifiant: "", reponses: [] }] } };
  }
}
