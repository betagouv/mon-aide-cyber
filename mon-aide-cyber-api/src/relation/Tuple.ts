import { Constructeur } from '../../test/constructeurs/constructeur';
import crypto from 'crypto';
import { Aggregat } from '../domaine/Aggregat';

type Relation = 'initiateur';

export type Utilisateur = {
  type: string;
  identifiant: string;
};

type Objet = {
  type: string;
  identifiant: string;
};

export type Tuple = Aggregat & {
  utilisateur: Utilisateur;
  relation: Relation;
  objet: Objet;
};

class ConstructeurUtilisateur implements Constructeur<Utilisateur> {
  private type = '';
  private identifiant = '';

  deTypeAidant(): ConstructeurUtilisateur {
    this.type = 'aidant';

    return this;
  }

  avecIdentifiant(identifiant: string): ConstructeurUtilisateur {
    this.identifiant = identifiant;

    return this;
  }

  construis(): Utilisateur {
    return {
      type: this.type,
      identifiant: this.identifiant,
    };
  }
}

class ConstructeurObjet implements Constructeur<Objet> {
  private type = '';
  private identifiant = '';

  deTypeDiagnostic(): ConstructeurObjet {
    this.type = 'diagnostic';

    return this;
  }

  avecIdentifiant(identifiant: string): ConstructeurObjet {
    this.identifiant = identifiant;

    return this;
  }

  construis(): Objet {
    return {
      type: this.type,
      identifiant: this.identifiant,
    };
  }
}

class ConstructeurTuple implements Constructeur<Tuple> {
  private utilisateur = {} as Utilisateur;
  private relation = '' as Relation;
  private objet = {} as Objet;

  avecUtilisateur(utilisateur: Utilisateur) {
    this.utilisateur = utilisateur;

    return this;
  }

  avecRelationInitiateur(): ConstructeurTuple {
    this.relation = 'initiateur';

    return this;
  }

  avecObjet(objet: Objet) {
    this.objet = objet;

    return this;
  }

  construis(): Tuple {
    return {
      identifiant: crypto.randomUUID(),
      utilisateur: this.utilisateur,
      relation: this.relation,
      objet: this.objet,
    };
  }
}

export const unUtilisateur = (): ConstructeurUtilisateur =>
  new ConstructeurUtilisateur();

export const unObjet = (): ConstructeurObjet => new ConstructeurObjet();

export const unTuple = (): ConstructeurTuple => new ConstructeurTuple();
