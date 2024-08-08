import crypto from 'crypto';

export type Corps = object;
export type Evenement = {
  identifiant: crypto.UUID;
  type: TypeEvenement;
  date: Date;
  corps: Corps;
};

export interface BusEvenement {
  publie<E extends Evenement>(evenement: E): Promise<void>;
}

export interface ConsommateurEvenement {
  consomme<E extends Evenement>(evenement: E): Promise<void>;
}

export type TypeEvenement =
  | 'DIAGNOSTIC_LANCE'
  | 'REPONSE_AJOUTEE'
  | 'RESTITUTION_LANCEE'
  | 'AIDANT_CREE'
  | 'AIDE_CREE'
  | 'DEMANDE_DEVENIR_AIDANT_CREEE';
