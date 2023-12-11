import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Indice } from '../../src/diagnostic/Indice';

export type Association = {
  identifiantRecommandation: string;
  niveauRecommandation: NiveauRecommandation;
  indice: Indice;
};
