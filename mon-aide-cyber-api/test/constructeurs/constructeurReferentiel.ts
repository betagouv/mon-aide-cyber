import {
  NiveauRecommandation,
  QuestionATiroir,
  QuestionChoixMultiple,
  QuestionChoixUnique,
  QuestionsThematique,
  Recommandation,
  Referentiel,
  ReponsePossible,
  TypeQuestion,
} from '../../src/diagnostic/Referentiel';
import { fakerFR as faker } from '@faker-js/faker';
import { Constructeur } from './constructeur';
import { aseptise } from '../utilitaires/aseptise';
import { Indice, Poids, Valeur } from '../../src/diagnostic/Indice';
import { Association } from './types';
import { uneAssociation } from './constructeurAssociation';

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  thematique: { [clef: string]: QuestionsThematique } = {
    ['contexte']: { questions: [] },
  };

  ajouteUneQuestionAuContexte(
    question: QuestionChoixUnique | QuestionChoixMultiple,
  ): ConstructeurReferentiel {
    this.thematique['contexte'].questions.push(question);
    return this;
  }

  ajouteUneThematique(
    theme: string,
    question: (QuestionChoixUnique | QuestionChoixMultiple)[],
  ): ConstructeurReferentiel {
    this.thematique[theme] = { questions: [...question] };
    return this;
  }

  sansThematique(): ConstructeurReferentiel {
    this.thematique = {};
    return this;
  }

  construis(): Referentiel {
    return Object.entries(this.thematique).reduce(
      (accumulateur, [clef, thematique]) => {
        return {
          ...accumulateur,
          [clef]: thematique,
        };
      },
      {},
    );
  }
}

class ConstructeurQuestion
  implements Constructeur<QuestionChoixUnique | QuestionChoixMultiple>
{
  private question: QuestionChoixUnique | QuestionChoixMultiple = {
    type: 'choixUnique',
    identifiant: '',
    libelle: 'Quelle est la réponse?',
    reponsesPossibles: [
      {
        identifiant: faker.string.alpha(10),
        libelle: faker.word.words(),
        ordre: 0,
      },
    ],
    poids: 1,
  };

  avecPoids(poids: Poids): ConstructeurQuestion {
    this.question.poids = poids;

    return this;
  }

  aChoixUnique(
    libelleQuestion: string,
    reponsesPossibles: { identifiant: string; libelle: string }[] = [],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = [];
    this.question.libelle = libelleQuestion;
    this.question.identifiant ||= aseptise(libelleQuestion);
    reponsesPossibles.forEach((reponse, index) =>
      this.question.reponsesPossibles.push({
        identifiant: reponse.identifiant,
        libelle: reponse.libelle,
        ordre: index,
      }),
    );
    return this;
  }

  aChoixMultiple(
    libelleQuestion: string,
    reponsesPossibles: {
      identifiant: string;
      libelle: string;
    }[] = [],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = [];
    this.question.libelle ||= libelleQuestion;
    this.question.identifiant = aseptise(libelleQuestion);
    this.question.type = 'choixMultiple';
    reponsesPossibles.forEach((reponse, index) =>
      this.question.reponsesPossibles.push({
        identifiant: reponse.identifiant,
        libelle: reponse.libelle,
        ordre: index,
      }),
    );
    return this;
  }

  avecReponsesPossibles(
    reponsesPossibles: ReponsePossible[],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = reponsesPossibles;
    return this;
  }

  avecIdentifiant(identifiant: string) {
    this.question.identifiant = identifiant;

    return this;
  }

  construis(): QuestionChoixUnique | QuestionChoixMultiple {
    return this.question;
  }
}

class ConstructeurListeDeQuestions
  implements Constructeur<(QuestionChoixUnique | QuestionChoixMultiple)[]>
{
  private libellesReponsesPossibles: {
    libelle: string;
    association?: Association;
  }[] = [];
  private labels: string[] = [];

  avecLesReponsesPossiblesSuivantesAssociees(
    libellesReponsesPossibles: {
      libelle: string;
      association?: Association;
    }[],
  ): ConstructeurListeDeQuestions {
    this.libellesReponsesPossibles = libellesReponsesPossibles;
    return this;
  }

  dontLesLabelsSont(labels: string[]): ConstructeurListeDeQuestions {
    this.labels = labels;
    return this;
  }

  construis(): (QuestionChoixUnique | QuestionChoixMultiple)[] {
    return this.labels.map((label) =>
      uneQuestion()
        .aChoixUnique(label)
        .avecReponsesPossibles(
          this.libellesReponsesPossibles.map((rep) => {
            let constructeurReponsePossible = uneReponsePossible().avecLibelle(
              rep.libelle,
            );
            if (rep.association) {
              constructeurReponsePossible =
                constructeurReponsePossible.associeeARecommandation(
                  rep.association?.identifiantRecommandation,
                  rep.association?.niveauRecommandation,
                  rep.association?.indice?.valeur,
                );
            }
            return constructeurReponsePossible.construis();
          }),
        )
        .construis(),
    );
  }
}

class ConstructeurQuestionATiroir implements Constructeur<QuestionATiroir> {
  private identifiant: string = faker.string.alpha(10);
  private libelle: string = faker.word.words();
  private reponsesPossibles: Omit<ReponsePossible, 'questions'>[] = [];
  private type: TypeQuestion = 'choixUnique';
  private poids: Poids = 1;

  aChoixMultiple = (libelle: string): ConstructeurQuestionATiroir => {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    this.type = 'choixMultiple';
    return this;
  };

  avecReponsesPossibles = (
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestionATiroir => {
    this.reponsesPossibles = reponsePossibles.map((reponse, index) => ({
      identifiant: reponse.identifiant,
      libelle: reponse.libelle,
      ordre: index,
      ...(reponse.resultat && { resultat: reponse.resultat }),
    }));
    return this;
  };

  aChoixUnique = (libelle: string): ConstructeurQuestionATiroir => {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    this.type = 'choixUnique';
    return this;
  };

  avecPoids(poids: Poids): ConstructeurQuestionATiroir {
    this.poids = poids;

    return this;
  }

  construis(): QuestionATiroir {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
      poids: this.poids,
    };
  }
}

class ConstructeurReponsePossible implements Constructeur<ReponsePossible> {
  private identifiant: string = faker.string.alpha(10);
  private libelle: string = faker.word.words();
  private ordre: number = faker.number.int();
  private questions?: QuestionATiroir[];
  private resultat?: {
    recommandations?: Recommandation[];
    indice: Indice;
  };

  ajouteUneQuestionATiroir(
    question: QuestionATiroir,
  ): ConstructeurReponsePossible {
    if (!this.questions) {
      this.questions = [];
    }
    this.questions.push(question);
    return this;
  }

  avecLibelle(libelle: string): ConstructeurReponsePossible {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    return this;
  }

  associeeARecommandation(
    identifiantRecommandation: string,
    niveauRecommandation: NiveauRecommandation,
    valeurIndice: Valeur,
  ): ConstructeurReponsePossible {
    const recommandations = [];
    recommandations.push({
      identifiant: identifiantRecommandation,
      niveau: niveauRecommandation,
    });
    this.resultat = {
      ...this.resultat,
      recommandations: [
        ...(this.resultat?.recommandations || []),
        ...recommandations,
      ],
      indice: { valeur: valeurIndice },
    };
    return this;
  }

  ayantPourValeurDIndice(valeurIndice: Valeur): ConstructeurReponsePossible {
    this.resultat = {
      ...this.resultat,
      indice: { valeur: valeurIndice },
    };
    return this;
  }

  construis(): ReponsePossible {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
      ...(this.resultat && {
        resultat: this.resultat,
      }),
      ...(this.questions && { questions: this.questions }),
    };
  }
}

export const unReferentiel = (): ConstructeurReferentiel =>
  new ConstructeurReferentiel();

export const unReferentielSansThematiques = (): ConstructeurReferentiel => {
  const constructeurReferentiel = new ConstructeurReferentiel();
  constructeurReferentiel.thematique = {};
  return constructeurReferentiel;
};

export const uneQuestion = (): ConstructeurQuestion =>
  new ConstructeurQuestion();

export const uneListeDeQuestions = (): ConstructeurListeDeQuestions =>
  new ConstructeurListeDeQuestions();

export const uneQuestionATiroir = (): ConstructeurQuestionATiroir =>
  new ConstructeurQuestionATiroir();

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
export const uneListeDe7QuestionsToutesAssociees = () =>
  uneListeDeQuestions()
    .dontLesLabelsSont(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'])
    .avecLesReponsesPossiblesSuivantesAssociees([
      {
        libelle: 'reponse 11',
        association: uneAssociation()
          .avecIdentifiant('q1')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 12',
        association: uneAssociation()
          .avecIdentifiant('q1')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 13' },
      { libelle: 'reponse 14' },
      {
        libelle: 'reponse 21',
        association: uneAssociation()
          .avecIdentifiant('q2')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 22',
        association: uneAssociation()
          .avecIdentifiant('q2')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 23' },
      { libelle: 'reponse 24' },
      {
        libelle: 'reponse 31',
        association: uneAssociation()
          .avecIdentifiant('q3')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 32',
        association: uneAssociation()
          .avecIdentifiant('q3')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 33' },
      { libelle: 'reponse 34' },
      {
        libelle: 'reponse 41',
        association: uneAssociation()
          .avecIdentifiant('q4')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 42',
        association: uneAssociation()
          .avecIdentifiant('q4')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 43' },
      { libelle: 'reponse 44' },
      {
        libelle: 'reponse 51',
        association: uneAssociation()
          .avecIdentifiant('q5')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 52',
        association: uneAssociation()
          .avecIdentifiant('q5')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 53' },
      { libelle: 'reponse 54' },
      {
        libelle: 'reponse 61',
        association: uneAssociation()
          .avecIdentifiant('q6')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 62',
        association: uneAssociation()
          .avecIdentifiant('q6')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 63' },
      { libelle: 'reponse 64' },
      {
        libelle: 'reponse 71',
        association: uneAssociation()
          .avecIdentifiant('q7')
          .deNiveau1()
          .ayantPourValeurDIndice(0)
          .construis(),
      },
      {
        libelle: 'reponse 72',
        association: uneAssociation()
          .avecIdentifiant('q7')
          .deNiveau2()
          .ayantPourValeurDIndice(1)
          .construis(),
      },
      { libelle: 'reponse 73' },
      { libelle: 'reponse 74' },
    ])
    .construis();
