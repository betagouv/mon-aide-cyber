import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';

export type Aide = Aggregat & {
  dateSignatureCGU: Date;
};
export type EntrepotAide = Entrepot<Aide>;
