import { Aggregat } from "../domaine/Aggregat";
import { Entrepot } from "../domaine/Entrepot";

export type EvenementJournal = Aggregat & {
  date: Date;
  type: string;
  donnees: object;
};
export type EntrepotEvenementJournal = Entrepot<EvenementJournal>;
