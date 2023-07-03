import { AdaptateurTranscripteur } from "../../adaptateurs/AdaptateurTranscripteur";
import { Transcripteur } from "../../api/representateurs/representateurDiagnostic";

export const adaptateurTranscripteur = () =>
  new (class implements AdaptateurTranscripteur {
    transcripteur(): Transcripteur {
      return {
        contexte: {
          questions: [
            {
              identifiant: "natureOrganisation",
              reponses: [
                {
                  identifiant: "autre",
                  type: { type: "saisieLibre", format: "texte" },
                },
              ],
            },
            {
              identifiant: "secteurActivite",
              type: "liste",
            },
          ],
        },
      };
    }
  })();
