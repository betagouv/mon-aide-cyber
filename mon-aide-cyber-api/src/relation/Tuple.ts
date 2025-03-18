import crypto from 'crypto';
import { Aggregat } from './Aggregat';

export type Relation = string;

export type TypeUtilisateur = string;

export type Utilisateur = {
  type: TypeUtilisateur;
  identifiant: string;
};

export type Objet = {
  type: string;
  identifiant: string;
};

export type Tuple = Aggregat & {
  utilisateur: Utilisateur;
  relation: Relation;
  objet: Objet;
};

interface Constructeur<T> {
  construis(): T;
}

class ConstructeurUtilisateur implements Constructeur<Utilisateur> {
  private type: TypeUtilisateur | undefined;
  private identifiant = '';

  deType(type: string): ConstructeurUtilisateur {
    this.type = type;
    return this;
  }

  avecIdentifiant(identifiant: string): ConstructeurUtilisateur {
    this.identifiant = identifiant;

    return this;
  }

  construis(): Utilisateur {
    return {
      type: this.type!,
      identifiant: this.identifiant,
    };
  }
}

class ConstructeurObjet implements Constructeur<Objet> {
  private type = '';
  private identifiant = '';

  avecIdentifiant(identifiant: string): ConstructeurObjet {
    this.identifiant = identifiant;
    return this;
  }

  deType(type: string): ConstructeurObjet {
    this.type = type;
    return this;
  }

  construis(): Objet {
    return {
      type: this.type,
      identifiant: this.identifiant,
    };
  }
}

class ConstructeurTuple<DEFINITION_TUPLE extends DefinitionTuple>
  implements Constructeur<Tuple>
{
  constructor(private readonly dsl: DSL<DEFINITION_TUPLE>) {}

  private utilisateur = {} as Utilisateur;
  private objet = {} as Objet;

  avecUtilisateur(
    identifiant: crypto.UUID | string
  ): ConstructeurTuple<DEFINITION_TUPLE> {
    this.utilisateur = new ConstructeurUtilisateur()
      .deType(this.dsl.definition.typeUtilisateur)
      .avecIdentifiant(identifiant)
      .construis();
    return this;
  }

  avecObjet(identifiant: crypto.UUID): ConstructeurTuple<DEFINITION_TUPLE> {
    this.objet = new ConstructeurObjet()
      .deType(this.dsl.definition.typeObjet)
      .avecIdentifiant(identifiant)
      .construis();
    return this;
  }

  construis(): Tuple {
    return {
      identifiant: crypto.randomUUID(),
      utilisateur: this.utilisateur,
      relation: this.dsl.definition.relation,
      objet: this.objet,
    };
  }
}

export type DefinitionTuple = {
  typeObjet: string;
  relation: string;
  typeUtilisateur: string;
};

export interface DSL<DEFINITION_TUPLE extends DefinitionTuple> {
  definition: DEFINITION_TUPLE;
}

export const unTuple = <DEFINITION_TUPLE extends DefinitionTuple>(
  dsl: DSL<DEFINITION_TUPLE>
): ConstructeurTuple<DEFINITION_TUPLE> =>
  new ConstructeurTuple<DEFINITION_TUPLE>(dsl);
