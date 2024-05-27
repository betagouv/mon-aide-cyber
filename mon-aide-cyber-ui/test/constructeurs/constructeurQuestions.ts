import { Constructeur } from './Constructeur';
import { uneReponsePossible } from './constructeurReponsePossible.ts';
import { faker } from '@faker-js/faker/locale/fr';
import {
  Question,
  QuestionATiroir,
  ReponseDonnee,
  ReponseMultiple,
  ReponsePossible,
  TypeDeSaisie,
} from '../../src/domaine/diagnostic/Referentiel.ts';
import { aseptise } from '../utilitaires/aseptise.ts';

class ConstructeurQuestion implements Constructeur<Question> {
  protected identifiant = faker.string.alpha(10);
  protected libelle = faker.word.words().concat(' ?');
  protected reponsesPossibles: ReponsePossible[] = [];
  protected type: TypeDeSaisie = 'choixUnique';
  private reponseDonnee: ReponseDonnee = {
    valeur: null,
    reponses: [],
  };

  avecDesReponses(reponsePossibles: ReponsePossible[]): ConstructeurQuestion {
    this.reponsesPossibles.push(...reponsePossibles);
    return this;
  }

  avecLaReponseDonnee(
    reponsePossible: ReponsePossible,
    reponses: ReponseMultiple[] = [],
  ): ConstructeurQuestion {
    this.reponseDonnee = {
      valeur: reponsePossible.identifiant,
      reponses,
    };
    return this;
  }

  avecUneReponseMultipleDonnee(
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestion {
    this.reponseDonnee = {
      valeur: null,
      reponses: [
        {
          identifiant: this.identifiant,
          reponses: new Set(reponsePossibles.map((rep) => rep.identifiant)),
        },
      ],
    };
    return this;
  }
  avecLibelle(libelle: string): ConstructeurQuestion {
    this.identifiant = aseptise(libelle);
    this.libelle = libelle;
    return this;
  }

  sousFormeDeListe(): ConstructeurQuestion {
    this.type = 'liste';
    return this;
  }

  construis(): Question {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponseDonnee: this.reponseDonnee,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
    };
  }
}

class ConstructeurQuestionTiroir implements Constructeur<QuestionATiroir> {
  protected identifiant = faker.string.alpha(10);
  protected libelle = faker.word.words().concat(' ?');
  protected reponsesPossibles: ReponsePossible[] = [];
  protected type: TypeDeSaisie = 'choixMultiple';

  avecLibelle(libelle: string): ConstructeurQuestionTiroir {
    this.identifiant = aseptise(libelle);
    this.libelle = libelle;
    return this;
  }

  avecNReponses(nombreReponses: number): ConstructeurQuestionTiroir {
    for (let i = 0; i < nombreReponses; i++) {
      this.reponsesPossibles.push(uneReponsePossible().construis());
    }
    return this;
  }
  avecDesReponses(
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestionTiroir {
    this.reponsesPossibles.push(...reponsePossibles);
    return this;
  }

  construis(): QuestionATiroir {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
    };
  }
}

class ConstructeurQuestionAChoixMultiple extends ConstructeurQuestion {
  constructor() {
    super();
    this.type = 'choixMultiple';
  }
}

class ConstructeurQuestionTiroirAChoixUnique extends ConstructeurQuestionTiroir {
  constructor() {
    super();
    this.type = 'choixUnique';
  }
}

class ConstructeurQuestionTiroirAChoixMultiple extends ConstructeurQuestionTiroir {
  constructor() {
    super();
    this.type = 'choixMultiple';
  }
}

class ConstructeurQuestionAChoixUnique extends ConstructeurQuestion {
  constructor() {
    super();
    this.type = 'choixUnique';
  }
}

export const uneQuestionAChoixMultiple = () =>
  new ConstructeurQuestionAChoixMultiple();

export const uneQuestionAChoixUnique = () =>
  new ConstructeurQuestionAChoixUnique();

export const uneQuestionTiroirAChoixUnique = () =>
  new ConstructeurQuestionTiroirAChoixUnique();
export const uneQuestionTiroirAChoixMultiple = () =>
  new ConstructeurQuestionTiroirAChoixMultiple();
