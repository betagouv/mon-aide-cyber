import { Transcripteur } from "../../../src/api/representateurs/types";

const transcripteurAvecSaisiesLibres = {
  contexte: {
    questions: [
      {
        identifiant: "quelle-est-la-question",
        reponses: [
          {
            identifiant: "reponse1",
            type: { type: "saisieLibre", format: "texte" },
          },
          {
            identifiant: "reponse2",
            type: { type: "saisieLibre", format: "nombre" },
          },
        ],
      },
    ],
  },
} as Transcripteur;

const transcripteurQuestionTiroir = {
  contexte: {
    questions: [
      {
        identifiant: "question-avec-reponse-tiroir",
        reponses: [
          {
            identifiant: "reponse-0",
            question: {
              identifiant: "question-tiroir",
              reponses: [
                {
                  identifiant: "reponse-3",
                  type: { type: "saisieLibre", format: "texte" },
                },
              ],
              type: "choixMultiple",
            },
          },
        ],
      },
    ],
  },
} as Transcripteur;

export { transcripteurAvecSaisiesLibres, transcripteurQuestionTiroir };
