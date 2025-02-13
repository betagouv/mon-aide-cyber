import { Aggregat } from '../domaine/Aggregat';
import { EntrepotEcriture } from '../domaine/Entrepot';

export type Publication = Aggregat & {
  date: Date;
  type: string;
  donnees: object;
};
export type EntrepotEvenementJournal = EntrepotEcriture<Publication>;
