import { Transcripteur } from "../api/representateurs/types";

export interface AdaptateurTranscripteur {
  transcripteur(): Transcripteur;
}
