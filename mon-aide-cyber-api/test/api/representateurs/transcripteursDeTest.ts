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
            },
          },
        ],
      },
    ],
  },
} as Transcripteur;

const transcripteurMultipleTiroir = {
  contexte: {
    questions: [
      {
        identifiant: "premiere-question",
        reponses: [
          {
            identifiant: "reponse-1",
            question: {
              identifiant: "question-11",
            },
          },
        ],
      },
      {
        identifiant: "deuxieme-question",
        reponses: [
          {
            identifiant: "reponse-2",
            question: {
              identifiant: "question-21",
            },
          },
        ],
      },
    ],
  },
} as Transcripteur;
const fabriqueTranscripteurVide = (): Transcripteur => {
  return {
    contexte: {
      questions: [],
    },
  };
};

export {
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
};
