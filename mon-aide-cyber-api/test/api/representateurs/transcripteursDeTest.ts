import { Transcripteur } from '../../../src/api/representateurs/types';

const transcripteurAvecSaisiesLibres = {
  thematiques: {
    contexte: {
      questions: [
        {
          identifiant: 'quelle-est-la-question',
          reponses: [
            {
              identifiant: 'reponse1',
              type: { type: 'saisieLibre', format: 'texte' },
            },
            {
              identifiant: 'reponse2',
              type: { type: 'saisieLibre', format: 'nombre' },
            },
          ],
        },
      ],
    },
  },
} as Transcripteur;

const transcripteurQuestionTiroir = {
  thematiques: {
    contexte: {
      questions: [
        {
          identifiant: 'question-avec-reponse-tiroir',
          reponses: [
            {
              identifiant: 'reponse-0',
              question: {
                identifiant: 'question-tiroir',
                reponses: [
                  {
                    identifiant: 'reponse-3',
                    type: { type: 'saisieLibre', format: 'texte' },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
} as Transcripteur;

const transcripteurMultipleTiroir = {
  thematiques: {
    contexte: {
      questions: [
        {
          identifiant: 'premiere-question',
          reponses: [
            {
              identifiant: 'reponse-1',
              question: {
                identifiant: 'question-11',
              },
            },
          ],
        },
        {
          identifiant: 'deuxieme-question',
          reponses: [
            {
              identifiant: 'reponse-2',
              question: {
                identifiant: 'question-21',
              },
            },
          ],
        },
      ],
    },
  },
} as Transcripteur;
const fabriqueTranscripteurVide = (): Transcripteur => {
  return {
    thematiques: {
      contexte: {
        questions: [],
      },
    },
  };
};

const fabriqueTranscripteurThematiquesOrdonnees = (
  ordreThematiques: string[],
): Transcripteur => {
  return { ordreThematiques: ordreThematiques, thematiques: {} };
};

export {
  fabriqueTranscripteurThematiquesOrdonnees,
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
};
