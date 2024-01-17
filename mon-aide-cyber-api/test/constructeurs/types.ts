import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Indice } from '../../src/diagnostic/Indice';

export type Association = {
  identifiantMesure: string;
  niveauMesure: NiveauRecommandation;
  indice: Indice;
};
