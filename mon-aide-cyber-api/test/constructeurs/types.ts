import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Valeur } from '../../src/diagnostic/Valeur';

export type Association = {
  identifiantRecommandation: string;
  niveauRecommandation: NiveauRecommandation;
  valeur: Valeur;
};
