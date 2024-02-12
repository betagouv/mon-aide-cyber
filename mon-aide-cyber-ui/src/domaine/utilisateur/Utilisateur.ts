import { ParametresAPI } from '../diagnostic/ParametresAPI.ts';
import { ReponseHATEOAS } from '../Actions.ts';

export type FinalisationCompte = { cguSignees: boolean };
export type CompteFinalise = ReponseHATEOAS;

export interface EntrepotUtilisateur {
  finaliseCreationCompte(
    parametresAPI: ParametresAPI,
    finalisationCompte: FinalisationCompte,
  ): Promise<CompteFinalise>;
}
