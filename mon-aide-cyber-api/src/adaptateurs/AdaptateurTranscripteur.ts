import { Transcripteur } from "../api/representateurs/representateurDiagnostique";

export interface AdaptateurTranscripteur {
  transcripteur(): Transcripteur;
}
