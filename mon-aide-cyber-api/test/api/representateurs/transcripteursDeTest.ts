import { Transcripteur } from '../../../src/api/representateurs/types';
import { Constructeur } from '../../constructeurs/constructeur';

const transcripteurAvecSaisiesLibres = {
  thematiques: {
    contexte: {
      libelle: 'Contexte',
      localisationIllustration: '/chemin/illustration/contexte',
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
      libelle: 'Contexte',
      localisationIllustration: '/chemin/illustration/contexte',
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
      libelle: 'Contexte',
      localisationIllustration: '/chemin/illustration/contexte',
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

class ConstructeurTranscripteur implements Constructeur<Transcripteur> {
  private thematiques: {
    [clef: string]: {
      libelle: string;
      localisationIllustration: string;
      questions: [];
    };
  } = {};
  private thematiquesOrdonnees: string[] = [];
  avecLesThematiques(thematiques: string[]): ConstructeurTranscripteur {
    thematiques.forEach((thematique) => {
      this.thematiques[thematique] = {
        libelle: thematique,
        localisationIllustration: `/chemin/illustration/${thematique}`,
        questions: [],
      };
    });
    return this;
  }

  ordonneLesThematiques(
    thematiquesOrdonnees: string[],
  ): ConstructeurTranscripteur {
    this.thematiquesOrdonnees = thematiquesOrdonnees;
    return this;
  }

  construis(): Transcripteur {
    return {
      ordreThematiques: this.thematiquesOrdonnees,
      thematiques: { ...this.thematiques },
    };
  }
}
const fabriqueTranscripteurVide = (): Transcripteur => {
  return {
    thematiques: {
      contexte: {
        libelle: 'Contexte',
        localisationIllustration: '/chemin/illustration/contexte',
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

const unTranscripteur = (): ConstructeurTranscripteur => {
  return new ConstructeurTranscripteur();
};

export {
  fabriqueTranscripteurThematiquesOrdonnees,
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
  unTranscripteur,
};
