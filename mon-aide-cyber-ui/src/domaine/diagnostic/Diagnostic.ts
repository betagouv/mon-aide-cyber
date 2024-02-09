import { Referentiel } from './Referentiel.ts';
import { Aggregat } from '../Aggregat.ts';

import { Entrepot } from '../Entrepots.ts';
import { LienRoutage } from '../LienRoutage.ts';
import { Restitution } from './Restitution.ts';
import { ParametresAPI } from './ParametresAPI.ts';

export type ActionReponseDiagnostic = {
  [thematique: string]: ActionBase;
};

export type ActionBase = {
  action: string;
  ressource: { url: string; methode: string };
};
export type Action = ActionBase | ActionReponseDiagnostic;

export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
  actions: Action[];
};
export type ReponseQuestionATiroir = {
  reponse: string;
  questions: {
    identifiant: string;
    reponses: string[];
  }[];
};
export type Reponse = {
  identifiantQuestion: string;
  reponseDonnee: string | string[] | ReponseQuestionATiroir | null;
};

export interface EntrepotDiagnostic extends Entrepot<Diagnostic> {
  lancer(lancerDiagnostic: ParametresAPI): Promise<LienRoutage>;

  repond: (
    action: ActionReponseDiagnostic,
    reponseDonnee: Reponse,
  ) => Promise<void>;

  restitution(
    idDiagnostic: string,
    parametresAPI?: ParametresAPI,
  ): Promise<Restitution>;
}
