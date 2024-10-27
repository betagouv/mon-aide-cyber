import {
  Mesure,
  NiveauMesure,
  QuestionATiroir,
  QuestionChoixMultiple,
  QuestionChoixUnique,
  QuestionsThematique,
  Referentiel,
  RegleDeGestionAjouteReponse,
  ReponsePossible,
  TypeQuestion,
} from '../../src/diagnostic/Referentiel';
import { fakerFR as faker } from '@faker-js/faker';
import { Constructeur } from './constructeur';
import { aseptise } from '../utilitaires/aseptise';
import { Indice, Poids, Valeur } from '../../src/diagnostic/Indice';
import { Association } from './types';
import { uneAssociation } from './constructeurAssociation';
import { donneesContexte } from '../../src/diagnostic/referentiel/donneesContexte';

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  thematique: { [clef: string]: QuestionsThematique } = {
    ['contexte']: { questions: [] },
  };

  ajouteUneQuestionAuContexte(
    question: QuestionChoixUnique | QuestionChoixMultiple
  ): ConstructeurReferentiel {
    this.thematique['contexte'].questions.push(question);
    return this;
  }

  ajouteUneThematique(
    theme: string,
    question: (QuestionChoixUnique | QuestionChoixMultiple)[]
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
      {}
    );
  }
}

class ConstructeurQuestion
  implements Constructeur<QuestionChoixUnique | QuestionChoixMultiple>
{
  private type: 'choixUnique' | 'choixMultiple' = 'choixUnique';
  private identifiant: string | undefined = undefined;
  private libelle = 'Quelle est la réponse?';
  private reponsesPossibles = [
    {
      identifiant: faker.string.alpha(10),
      libelle: faker.word.words(),
      ordre: 0,
    },
  ];
  private poids: Poids = 1;

  avecPoids(poids: Poids): ConstructeurQuestion {
    this.poids = poids;
    return this;
  }

  aChoixUnique(
    libelleQuestion: string,
    reponsesPossibles: { identifiant: string; libelle: string }[] = []
  ): ConstructeurQuestion {
    this.reponsesPossibles = [];
    this.libelle = libelleQuestion;
    this.identifiant ||= aseptise(libelleQuestion);
    reponsesPossibles.forEach((reponse, index) =>
      this.reponsesPossibles.push({
        identifiant: reponse.identifiant,
        libelle: reponse.libelle,
        ordre: index,
      })
    );
    return this;
  }

  aChoixMultiple(
    libelleQuestion: string,
    reponsesPossibles: {
      identifiant: string;
      libelle: string;
    }[] = []
  ): ConstructeurQuestion {
    this.reponsesPossibles = [];
    this.libelle ||= libelleQuestion;
    this.identifiant = aseptise(libelleQuestion);
    this.type = 'choixMultiple';
    reponsesPossibles.forEach((reponse, index) =>
      this.reponsesPossibles.push({
        identifiant: reponse.identifiant,
        libelle: reponse.libelle,
        ordre: index,
      })
    );
    return this;
  }

  avecReponsesPossibles(
    reponsesPossibles: ReponsePossible[]
  ): ConstructeurQuestion {
    this.reponsesPossibles = reponsesPossibles;
    return this;
  }

  avecIdentifiant(identifiant: string) {
    this.identifiant = identifiant;
    return this;
  }

  construis(): QuestionChoixUnique | QuestionChoixMultiple {
    return {
      type: this.type,
      ...((this.identifiant && { identifiant: this.identifiant }) || {
        identifiant: faker.string.alpha(10),
      }),
      libelle: this.libelle,
      reponsesPossibles: this.reponsesPossibles,
      poids: this.poids,
    };
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
    }[]
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
              rep.libelle
            );
            if (rep.association) {
              constructeurReponsePossible =
                constructeurReponsePossible.associeeAMesure(
                  rep.association?.identifiantMesure,
                  rep.association?.niveauMesure,
                  rep.association?.indice?.valeur
                );
            }
            return constructeurReponsePossible.construis();
          })
        )
        .construis()
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
    reponsePossibles: ReponsePossible[]
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
    mesures?: Mesure[];
    indice: Indice;
  };
  private regleDeGestion: RegleDeGestionAjouteReponse | undefined = undefined;

  ajouteUneQuestionATiroir(
    question: QuestionATiroir
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

  associeeAMesure(
    identifiantMesure: string,
    niveauMesure: NiveauMesure,
    valeurIndice: Valeur
  ): ConstructeurReponsePossible {
    const mesures = [];
    mesures.push({
      identifiant: identifiantMesure,
      niveau: niveauMesure,
    });
    this.resultat = {
      ...this.resultat,
      mesures: [...(this.resultat?.mesures || []), ...mesures],
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

  ajouteUneRegleDeGestion(
    regleDeGestion: { reponseDonnee: string; identifiantQuestion: string }[]
  ): ConstructeurReponsePossible {
    this.regleDeGestion = {
      reponses: regleDeGestion,
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
      ...(this.regleDeGestion !== undefined && { regle: this.regleDeGestion }),
    };
  }
}

export const unReferentiel = (): ConstructeurReferentiel =>
  new ConstructeurReferentiel();

export const unReferentielAvecContexteComplet = (): ConstructeurReferentiel => {
  const constructeurReferentiel =
    new ConstructeurReferentiel().sansThematique();
  constructeurReferentiel.ajouteUneThematique(
    'contexte',
    donneesContexte.questions
  );
  return constructeurReferentiel;
};

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
export const uneListeDe7QuestionsToutesAssociees = (): (
  | QuestionChoixUnique
  | QuestionChoixMultiple
)[] =>
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
