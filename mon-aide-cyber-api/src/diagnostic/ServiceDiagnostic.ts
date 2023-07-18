import { Diagnostic } from "./Diagnostic";
import * as crypto from "crypto";
import { AdaptateurReferentiel } from "../adaptateurs/AdaptateurReferentiel";
import { Entrepots } from "../domaine/Entrepots";

export type CorpsReponse = {
  chemin: "contexte";
  identifiant: string;
  reponse: string;
};

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: AdaptateurReferentiel,
    private readonly entrepots: Entrepots,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    this.entrepots.diagnostic().lis(id);

  cree = async (): Promise<Diagnostic> => {
    return this.adaptateurReferentiel.lis().then((referentiel) => {
      const diagnostic: Diagnostic = {
        identifiant: crypto.randomUUID(),
        referentiel,
      };
      this.entrepots.diagnostic().persiste(diagnostic);
      return Promise.resolve(diagnostic);
    });
  };

  ajouteLaReponse = async (
    id: crypto.UUID,
    corspsReponse: CorpsReponse,
  ): Promise<void> => {
    return this.entrepots
      .diagnostic()
      .lis(id)
      .then((diagnostic) => {
        const questionTrouvee = diagnostic.referentiel[
          corspsReponse.chemin
        ].questions.find((q) => q.identifiant === corspsReponse.identifiant);
        if (questionTrouvee !== undefined) {
          questionTrouvee.reponseDonnee = { valeur: corspsReponse.reponse };
        }
      });
  };
}
