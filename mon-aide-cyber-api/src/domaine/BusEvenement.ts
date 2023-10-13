import crypto from 'crypto';

export type Evenement = {
  identifiant: crypto.UUID;
  type: 'DIAGNOSTIC_LANCE' | 'REPONSE_AJOUTEE' | 'DIAGNOSTIC_TERMINE';
  date: Date;
  corps: object;
};

export interface BusEvenement {
  publie<E extends Evenement>(evenement: E): Promise<void>;
}
