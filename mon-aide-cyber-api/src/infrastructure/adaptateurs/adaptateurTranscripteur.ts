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
              identifiant: "cyberAttaqueSubie",
              reponses: [
                {
                  identifiant: "cyberAttaqueSubie-oui",
                  question: {
                    identifiant: "cyberAttaqueSubieTiroir",
                    type: "choixMultiple",
                  },
                },
              ],
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
            {
              identifiant: "cyberAttaqueSubie",
              reponses: [
                {
                  identifiant: "cyberAttaqueSubie-oui",
                  reponses: [
                    {
                      identifiant: "cyberAttaqueSubie-Oui-oui-autre",
                      type: { type: "saisieLibre", format: "texte" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
    }
  })();
