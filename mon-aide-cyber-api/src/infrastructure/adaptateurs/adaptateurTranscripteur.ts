import { AdaptateurTranscripteur } from "../../adaptateurs/AdaptateurTranscripteur";

import { Transcripteur } from "../../api/representateurs/types";

export const adaptateurTranscripteur = () =>
  new (class implements AdaptateurTranscripteur {
    transcripteur(): Transcripteur {
      return {
        contexte: {
          questions: [
            {
              identifiant: "nature-organisation",
              reponses: [
                {
                  identifiant: "nature-organisation-autre",
                  type: { type: "saisieLibre", format: "texte" },
                },
              ],
            },
            {
              identifiant: "secteur-activite",
              type: "liste",
            },
            {
              identifiant: "usage-cloud",
              reponses: [
                {
                  identifiant: "usage-cloud-oui",
                  question: {
                    identifiant: "usage-cloud-oui-question-tiroir-usages",
                    type: "choixMultiple",
                    reponses: [
                      {
                        identifiant:
                          "usage-cloud-oui-question-tiroir-usages-autre",
                        type: { type: "saisieLibre", format: "texte" },
                      },
                    ],
                  },
                },
              ],
            },
            {
              identifiant: "cyber-attaque-subie",
              reponses: [
                {
                  identifiant: "cyber-attaque-subie-oui",
                  question: {
                    identifiant: "cyber-attaque-subie-oui-tiroir-type",
                    type: "choixMultiple",
                    reponses: [
                      {
                        identifiant:
                          "cyber-attaque-subie-oui-tiroir-type-autre",
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
