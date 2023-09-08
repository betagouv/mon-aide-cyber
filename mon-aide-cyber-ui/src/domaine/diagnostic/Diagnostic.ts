import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot } from "../Entrepots.ts";
import { LienRoutage } from "../LienRoutage.ts";

export type ActionDiagnostic = {
  action: "repondre";
  chemin: string;
  ressource: { url: string; methode: "PATCH" };
};
export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
};
export type ReponseQuestionATiroir = {
  reponse: string;
  questions: {
    identifiant: string;
    reponses: string[];
  }[];
};
export type Reponse = {
  reponseDonnee: string | ReponseQuestionATiroir | null;
  identifiantQuestion: string;
};
export interface EntrepotDiagnostic extends Entrepot<Diagnostic> {
  lancer(): Promise<LienRoutage>;

  repond: (action: ActionDiagnostic, reponseDonnee: Reponse) => Promise<void>;
}
