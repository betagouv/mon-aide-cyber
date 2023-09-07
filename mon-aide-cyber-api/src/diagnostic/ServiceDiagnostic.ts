import {
  ajouteLaReponseAuDiagnostic,
  Diagnostic,
  initialiseDiagnostic,
} from "./Diagnostic";
import * as crypto from "crypto";
import { AdaptateurReferentiel } from "../adaptateurs/AdaptateurReferentiel";
import { Entrepots } from "../domaine/Entrepots";

export type CorpsReponseQuestionATiroir = {
  reponse: string;
  question?: {
    identifiant: string;
    reponses: string[];
  };
  questions?: { identifiant: string; reponses: string[] }[];
};
export type CorpsReponse = {
  chemin: string;
  identifiant: string;
  reponse: string | CorpsReponseQuestionATiroir;
};

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: AdaptateurReferentiel,
    private readonly entrepots: Entrepots,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    this.entrepots.diagnostic().lis(id);

  lance = async (): Promise<Diagnostic> => {
    return this.adaptateurReferentiel.lis().then((r) => {
      const diagnostic = initialiseDiagnostic(r);
      this.entrepots.diagnostic().persiste(diagnostic);
      return Promise.resolve(diagnostic);
    });
  };

  ajouteLaReponse = async (
    id: crypto.UUID,
    corpsReponse: CorpsReponse,
  ): Promise<void> => {
    return this.entrepots
      .diagnostic()
      .lis(id)
      .then((diagnostic) => {
        ajouteLaReponseAuDiagnostic(diagnostic, corpsReponse);
      });
  };
}
