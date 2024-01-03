import {
  QuestionATranscrire,
  Transcripteur,
} from '../../../src/api/representateurs/types';
import { Constructeur } from '../../constructeurs/constructeur';
import { fakerFR } from '@faker-js/faker';

const transcripteurAvecSaisiesLibres = {
  thematiques: {
    contexte: {
      description: fakerFR.lorem.sentence(),
      libelle: 'Contexte',
      localisationIconeNavigation: '/chemin/icone/contexte',
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
      groupes: [
        {
          numero: 1,
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
      ],
    },
  },
} as Transcripteur;

const transcripteurQuestionTiroir = {
  thematiques: {
    contexte: {
      description: fakerFR.lorem.sentence(),
      libelle: 'Contexte',
      localisationIconeNavigation: '/chemin/icone/contexte',
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
      groupes: [
        {
          numero: 1,
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
      ],
    },
  },
} as Transcripteur;

const transcripteurMultipleTiroir = {
  thematiques: {
    contexte: {
      description: fakerFR.lorem.sentence(),
      libelle: 'Contexte',
      localisationIconeNavigation: '/chemin/icone/contexte',
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
      groupes: [
        {
          numero: 1,
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
      ],
    },
  },
} as Transcripteur;

class ConstructeurTranscripteur implements Constructeur<Transcripteur> {
  private thematiques: {
    [clef: string]: {
      libelle: string;
      localisationIconeNavigation: string;
      localisationIllustration: string;
      description: string;
      questions: QuestionATranscrire[];
      groupes: { numero: number; questions: QuestionATranscrire[] }[];
    };
  } = {};
  private thematiquesOrdonnees: string[] = [];

  avecLesThematiques(thematiques: string[]): ConstructeurTranscripteur {
    thematiques.forEach((thematique) => {
      this.thematiques[thematique] = {
        libelle: thematique,
        localisationIconeNavigation: `/chemin/icone/${thematique}`,
        localisationIllustration: `/chemin/illustration/${thematique}`,
        description: fakerFR.lorem.sentence(),
        questions: [],
        groupes: [],
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

  avecLesDescriptions(
    descriptions: { thematique: string; description: string }[],
  ): ConstructeurTranscripteur {
    descriptions.forEach((description) => {
      Object.entries(this.thematiques).forEach(([clef, thematique]) => {
        if (description.thematique === clef) {
          thematique.description = description.description;
        }
      });
    });
    return this;
  }

  avecLesQuestionsGroupees(
    groupes: {
      groupes: { questions: QuestionATranscrire[] }[];
      thematique: string;
    }[],
  ): ConstructeurTranscripteur {
    groupes.forEach((groupe) => {
      groupe.groupes.forEach((g) => {
        this.thematiques[groupe.thematique].groupes.push({
          numero: this.thematiques[groupe.thematique].groupes.length + 1,
          questions: g.questions,
        });
      });
    });
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
        description: fakerFR.lorem.sentence(),
        libelle: 'Contexte',
        localisationIconeNavigation: '/chemin/icone/contexte',
        localisationIllustration: '/chemin/illustration/contexte',
        questions: [],
        groupes: [],
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
