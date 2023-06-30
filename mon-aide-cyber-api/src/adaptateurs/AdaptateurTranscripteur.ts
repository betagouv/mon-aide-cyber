import { Transcripteur } from "../api/representateurs/representateurDiagnostic";

export interface AdaptateurTranscripteur {
  transcripteur(): Transcripteur;
}
