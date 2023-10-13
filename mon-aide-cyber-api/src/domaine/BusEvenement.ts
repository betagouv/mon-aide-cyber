import crypto from 'crypto';

export type Evenement = {
  identifiant: crypto.UUID;
  type: TypeEvenement;
  date: Date;
  corps: object;
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
  | 'DIAGNOSTIC_TERMINE';
