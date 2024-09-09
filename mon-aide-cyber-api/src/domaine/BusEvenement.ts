import crypto from 'crypto';

export type Corps<T> = T;

export type Evenement<T> = {
  identifiant: crypto.UUID;
  type: TypeEvenement;
  date: Date;
  corps: Corps<T>;
};

export interface BusEvenement {
  publie<E extends Evenement<unknown>>(evenement: E): Promise<void>;
}

export interface ConsommateurEvenement {
  consomme<E extends Evenement<unknown>>(evenement: E): Promise<void>;
}

export type TypeEvenement =
  | 'DIAGNOSTIC_LANCE'
  | 'REPONSE_AJOUTEE'
  | 'RESTITUTION_LANCEE'
  | 'AIDANT_CREE'
  | 'AIDE_CREE'
  | 'DEMANDE_DEVENIR_AIDANT_CREEE'
  | 'MAIL_CREATION_COMPTE_AIDANT_ENVOYE'
  | 'MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE';
