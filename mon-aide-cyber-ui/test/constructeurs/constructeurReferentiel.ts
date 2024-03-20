import { faker } from '@faker-js/faker/locale/fr';
import {
  Question,
  Referentiel,
  ReponsePossible,
  Thematique,
  TypeDeSaisie,
} from '../../src/domaine/diagnostic/Referentiel.ts';
import { Constructeur } from './Constructeur.ts';
import { uneReponsePossible } from './constructeurReponsePossible.ts';
import { fakerFR } from '@faker-js/faker';

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  private thematique: {
    [clef: string]: Thematique;
  } = {
    ['contexte']: {
      actions: [],
      groupes: [],
      libelle: fakerFR.word.words(4),
      description: fakerFR.lorem.sentence(),
      localisationIconeNavigation: '',
      localisationIllustration: '',
    },
  };

  avecUneQuestionEtDesReponses(
    question: {
      libelle: string;
      type: Exclude<TypeDeSaisie, 'aCocher' | 'saisieLibre'>;
    },
    reponsePossibles: ReponsePossible[] = [],
  ): ConstructeurReferentiel {
    if (reponsePossibles.length === 0) {
      reponsePossibles.push(uneReponsePossible().construis());
    }

    const creeQuestion = () => ({
      identifiant: faker.string.alpha(10),
      libelle: question.libelle,
      reponseDonnee: { valeur: null, reponses: [] },
      reponsesPossibles: reponsePossibles.map((reponse, index) => ({
        ordre: reponse.ordre !== undefined ? reponse.ordre : index,
        libelle: reponse.libelle,
        identifiant: faker.string.alpha(10),
        type: reponse.type,
      })),
      type: question.type,
    });

    this.thematique['contexte'].groupes.push({
      numero: this.thematique['contexte'].groupes.length + 1,
      questions: [creeQuestion()],
    });
    return this;
  }

  avecUneQuestion(question: Question): ConstructeurReferentiel {
    this.thematique['contexte'].groupes.push({
      numero: this.thematique['contexte'].groupes.length + 1,
      questions: [question],
    });
    return this;
  }

  ajouteUneThematique(theme: string, questions: Question[]): ConstructeurReferentiel {
    this.thematique[theme] = {
      actions: [],
      description: fakerFR.lorem.sentence(),
      groupes: questions.map((q, index) => ({
        numero: index + 1,
        questions: [q],
      })),
      libelle: theme,
      localisationIconeNavigation: '',
      localisationIllustration: '',
    };
    return this;
  }

  construis(): Referentiel {
    return Object.entries(this.thematique).reduce((accumulateur, [clef, thematique]) => {
      return {
        ...accumulateur,
        [clef]: thematique,
      };
    }, {});
  }
}

export const unReferentiel = () => new ConstructeurReferentiel();
