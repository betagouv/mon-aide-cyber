import { AdaptateurTranscripteur } from "../../adaptateurs/AdaptateurTranscripteur";

import { Transcripteur } from "../../api/representateurs/types";

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
            {
              identifiant: "usageCloud",
              reponses: [
                {
                  identifiant: "usageCloud-oui",
                  question: {
                    identifiant: "usageCloudQuestionTiroir",
                    type: "choixMultiple",
                    reponses: [
                      {
                        identifiant: "usageCloud-Oui-Autre",
                        type: { type: "saisieLibre", format: "texte" },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      };
    }
  })();
