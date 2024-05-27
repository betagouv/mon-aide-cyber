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
      styles: {
        navigation: 'navigation-contexte',
        illustration: 'illustration-contexte',
      },
      localisationIllustration: '/chemin/illustration/contexte',
      groupes: [
        {
          questions: [
            {
              identifiant: 'quelle-est-la-question',
              reponses: [
                {
                  identifiant: 'reponse1',
                },
                {
                  identifiant: 'reponse2',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  generateurInfoBulle: (infoBulle) => infoBulle,
} as Transcripteur;

const transcripteurQuestionTiroir = {
  thematiques: {
    contexte: {
      description: fakerFR.lorem.sentence(),
      libelle: 'Contexte',
      styles: {
        navigation: 'navigation-contexte',
        illustration: 'illustration-contexte',
      },
      localisationIllustration: '/chemin/illustration/contexte',
      groupes: [
        {
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
  generateurInfoBulle: (infoBulle) => infoBulle,
} as Transcripteur;

const transcripteurMultipleTiroir = {
  thematiques: {
    contexte: {
      description: fakerFR.lorem.sentence(),
      libelle: 'Contexte',
      styles: {
        navigation: 'navigation-contexte',
        illustration: 'illustration-contexte',
      },
      localisationIllustration: '/chemin/illustration/contexte',
      groupes: [
        {
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
  generateurInfoBulle: (infoBulle) => infoBulle,
} as Transcripteur;

class ConstructeurTranscripteur implements Constructeur<Transcripteur> {
  private thematiques: {
    [clef: string]: {
      libelle: string;
      styles: {
        navigation: `navigation-${string}`;
        illustration: `illustration-${string}`;
      };
      localisationIconeNavigation: string;
      localisationIllustration: string;
      description: string;
      groupes: { questions: QuestionATranscrire[] }[];
    };
  } = {};
  private thematiquesOrdonnees: string[] = [];

  avecLesThematiques(thematiques: string[]): ConstructeurTranscripteur {
    thematiques.forEach((thematique) => {
      this.thematiques[thematique] = {
        libelle: thematique,
        styles: {
          navigation: `navigation-${thematique}`,
          illustration: `illustration-${thematique}`,
        },
        localisationIconeNavigation: `/chemin/icone/${thematique}`,
        localisationIllustration: `/chemin/illustration/${thematique}`,
        description: fakerFR.lorem.sentence(),
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
      generateurInfoBulle: (infoBulles) => infoBulles,
    };
  }
}

const fabriqueTranscripteurVide = (): Transcripteur => {
  return {
    thematiques: {
      contexte: {
        description: fakerFR.lorem.sentence(),
        libelle: 'Contexte',
        styles: {
          navigation: 'navigation-contexte',
        },
        localisationIllustration: '/chemin/illustration/contexte',
        groupes: [],
      },
    },
    generateurInfoBulle: (infoBulle) => infoBulle,
  };
};

const unTranscripteur = (): ConstructeurTranscripteur => {
  return new ConstructeurTranscripteur();
};

export {
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
  unTranscripteur,
};
