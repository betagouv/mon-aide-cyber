import { AdaptateurTranscripteur } from "../../adaptateurs/AdaptateurTranscripteur";

import { Transcripteur } from "../../api/representateurs/types";

export const adaptateurTranscripteur = () =>
  new (class implements AdaptateurTranscripteur {
    transcripteur(): Transcripteur {
      return {
        contexte: {
          questions: [
            // {
            //   identifiant: "contexte-nature-organisation",
            //   reponses: [
            //     {
            //       identifiant: "nature-organisation-autre",
            //       type: { type: "saisieLibre", format: "texte" },
            //     },
            //   ],
            // },
            {
              identifiant: "contexte-secteur-activite",
              type: "liste",
            },
            { identifiant: "contexte-region-siege-social", type: "liste" },
            {
              identifiant: "contexte-departement-tom-siege-social",
              type: "liste",
            },
            // {
            //   identifiant: "contexte-usage-cloud",
            //   reponses: [
            //     {
            //       identifiant: "usage-cloud-oui",
            //       question: {
            //         identifiant: "contexte-usage-cloud-oui-question-tiroir-usages",
            //         type: "choixMultiple",
            //         reponses: [
            //           {
            //             identifiant:
            //               "contexte-usage-cloud-oui-question-tiroir-usages-autre",
            //             type: { type: "saisieLibre", format: "texte" },
            //           },
            //         ],
            //       },
            //     },
            //   ],
            // },
            // {
            //   identifiant: "contexte-cyber-attaque-subie",
            //   reponses: [
            //     {
            //       identifiant: "contexte-cyber-attaque-subie-oui",
            //       question: {
            //         identifiant: "contexte-cyber-attaque-subie-oui-tiroir-type",
            //         type: "choixMultiple",
            //         reponses: [
            //           {
            //             identifiant:
            //               "contexte-cyber-attaque-subie-oui-tiroir-type-autre",
            //             type: { type: "saisieLibre", format: "texte" },
            //           },
            //         ],
            //       },
            //     },
            //   ],
            // },
          ],
        },
      };
    }
  })();
